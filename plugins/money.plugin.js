var fx = require('money'),
	exchange = require('exchange-rates');
var getRates = function(key, callback){
	exchange.url = 'http://openexchangerates.org/api/latest.json?app_id=' + key;
	exchange.load(function(){
		if(typeof callback == 'function'){
			callback({'rates': exchange.rates, 'base': exchange.base});
		}
	});
}
exports.init = function(plugins, bot){
	var self = this;
	bot.addCommand('money', '<value> <from> <to>', 'Converts currency', USER_LEVEL_GLOBAL);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'money':
				if(args.arguments && args.arguments[0] && args.arguments[1] && args.arguments[2]){
					var value = args.arguments[0];
					var from = args.arguments[1].toUpperCase();
					var to = args.arguments[2].toUpperCase();
					var response;
					getRates(self.config.key, function(data){
						fx.rates = data.rates;
						fx.base = data.base;
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