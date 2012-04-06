var http = require('http');
var config = {results: 1};
var result = {};
google = function(channel, keywords){
	var options = {
		host: 'ajax.googleapis.com',
		path: '/ajax/services/search/web?v=1.0&q=' + keywords
	};
	http.get(options, function(res) {
		var data = '';
		res.on('data', function (chunk){
			data += chunk;
		});
		res.on('end',function(err){
			if(err){
				throw err;
			}
			// Google returns HTML in their JSON api (wtf?) when there is something wrong
			try{
				result = JSON.parse(data);
			}catch(e){
				IRC.message(channel, 'Google returned an error.');
				return;
			}
			if(result && result.responseData && result.responseData.results && result.responseData.results[0]){
				var returned = result.responseData.results[0];
				IRC.message(channel, returned.titleNoFormatting + ' - ' + returned.url);
			}else{
				IRC.message(channel, 'No search results returned for that keyword.');
			}
		});
	});
}
exports.init = function(plugins, bot){
	bot.addCommand('google', '[<keywords>]', 'Google keyword', USER_LEVEL_GLOBAL);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'google':
			if(args && args.arguments[0]){
				var keywords = args.message
					.replace(bot.config.prefix+args.command, '')
					.trim()
					.replace(' ', '+');
				google(args.channel, keywords);
			}
			break;
		}
	});
}