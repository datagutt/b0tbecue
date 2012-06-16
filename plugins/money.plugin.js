var fx = require('money');
var http = require('http');
var getRates = function(callback){
	var options = {host: 'openexchangerates.org', path: '/latest.json'}, quote;
	http.get(options, function(res) {
		var data = '';
		res.on('data', function (chunk){
			data += chunk;
		});
		res.on('end',function(err){
			if(err){
				throw err;
			}
			data = JSON.parse(data);
			if(typeof callback == 'function'){
				callback(data);
			}
		});
	});
}
exports.init = function(plugins, bot){
	bot.addCommand('money', '<value> <from> <to>', 'Converts currency', USER_LEVEL_GLOBAL);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'money':
				if(args.arguments && args.arguments[0] && args.arguments[1] && args.arguments[2]){
					var value = parseInt(args.arguments[0]);
					var from = args.arguments[1].toUpperCase();
					var to = args.arguments[2].toUpperCase();
					var response;
					getRates(function(data){
						fx.rates = data.rates;
						try{
							var response = fx.convert(value, {'from': from, 'to': to});
						}catch(e){
							IRC.message(args.channel, 'We cant convert between those currencies!');
						}
						if(response){
							IRC.message(args.channel, value + ' ' + from + ' = ' +  response.toFixed(2) + ' ' + to);
						}
					});
				}else{
					IRC.message(args.channel, 'Invalid parameters!');
				}
			break;
		}
	});
}