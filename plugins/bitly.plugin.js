var Bitly = require('bitly');
exports.init = function(plugins, bot){
	var bitly = new Bitly(this.config.username, this.config.key);
	bot.addCommand('shorten', '<link>', 'Shortens links with bitly', USER_LEVEL_GLOBAL, true);
	bot.addCommand('unshorten', '<link>', 'Unshortens bitly links', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'shorten':
				if(args.arguments && args.arguments[0]){
					bitly.shorten(args.arguments[0], function(err, response){
						if(err || !response.data.url){
							IRC.message(args.channel, 'Error retreiving shortened link');
							return;
						}
						IRC.message(args.channel, args.user + ': ' + response.data.url);
					});
				}
			break;
			case 'unshorten':
				if(args.arguments && args.arguments[0]){
					bitly.expand(args.arguments[0], function(err, response){
						if(err || !response.data.expand[0].long_url){
							IRC.message(args.channel, 'Error retreiving unshortened link');
							return;
						}
						IRC.message(args.channel, args.user + ': ' + response.data.expand[0].long_url);
					});
				}
			break;
		}
	});
}
