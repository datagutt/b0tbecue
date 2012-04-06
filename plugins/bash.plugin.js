var querystring = require('querystring');
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
			data = data.replace(/(\r\n|\n|\r)/gm, '');
			var parsed = data.match(/<p class=\"qt\">(.*?)<\/p>/);
			quote = parsed ? parsed[1] : '';
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
var addQuote = function(channel, quote){
	var post_data = querystring.stringify({
		'newquote': quote, 
		'strip': 'on', 
		'submit1': 'Submit Quote'
	});
	var options = {
		host: 'bash.org', 
		path: '?add',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			chunk = chunk.replace(/(\r\n|\n|\r)/gm, '');
			chunk = chunk.replace(/<br \/>+/g, '\n');
			var message = chunk.match(/<font class=\"bodytext\">(.*?)<\/font>/i);
			if(message && message[0]){
				var id = message[0].match(/(#(.*))/);
				if(id && id[0]){
					id = id[0].split('.')[0].replace(/<(?:.|\n)*?>/gm, '');
					if(/already exists/.exec(message)){
						IRC.message(channel, 'Quote ' + id + ' already exists!');
					}else{
						IRC.message(channel, 'Quote added as ' + id + '.');
					}
				}
			}
		});
	});
	req.write(post_data);
	req.end();
}
exports.init = function(plugins, bot){
	bot.addCommand('bash', '[<id>]', 'Gets random bash quote or by id', USER_LEVEL_GLOBAL);
	bot.addCommand('addQuote', '<quote>', 'Adds quote to bash', USER_LEVEL_GLOBAL);
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
			case 'addQuote':
				quote = args.arguments.join(' ');
				addQuote(args.channel, quote);
			break;
		}
	});
};
