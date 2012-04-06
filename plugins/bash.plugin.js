var http = require('http');
var bash = function(channel, id){
	var options = {host: 'bash.org', path: '?' + id}, quote;
	http.get(options, function(res) {
		var data = '';
		res.on('data', function (chunk){
			data += chunk;
		});
		res.on('end',function(err){
			if(err){
				throw err;
			}
			data = data.replace(/(\r\n|\n|\r)/gm,"")
			console.log(data);
			var parsed = data.match(/<p class=\"qt\">(.*?)<\/p>/);
			quote = parsed ? parsed[1] : '';
			console.log(parsed);
			if(quote){
				quote = quote.replace(/&quot;+/g, '"');
				quote = quote.replace(/&lt;+/g, '<');
				quote = quote.replace(/&gt;+/g, '>');
				quote = quote.replace(/&nbsp;+/g, ' ');
				IRC.message(channel, 'Bash.org quote: ');
				IRC.message(channel, quote.replace(/<br \/>+/g, '\n'));
			}else if(data.match(/<font class=\"bodytext\">(.*?)<\/font>/i)){
				IRC.message(channel, 'Quote #' + id + ' does not exist!');
			}
		});
	});
	return quote;
}
exports.init = function(plugins, bot){
	bot.addCommand('bash', '[<id>]', 'Gets random bash quote or by id', USER_LEVEL_GLOBAL);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'bash':
				if(args.arguments && args.arguments[0]){
					id = args.arguments[0];
				}else{
					id = 'random';
				}
				bash(args.channel, id);
			break;
		}
	});
};