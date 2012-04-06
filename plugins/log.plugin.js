var Color = {};
var Format = {};

Color.BLACK = '\033[30m';
Color.RED = '\033[31m';
Color.GREEN = '\033[32m';
Color.YELLOW = '\033[33m';
Color.BLUE = '\033[34m';
Color.MAGENTA = '\033[35m';
Color.CYAN = '\033[36m';
Color.WHITE = '\033[31m';

Format.RESET = '\033[0;0m';
Format.NORMAL = '\033[0m';
Format.BOLD = '\033[1m';

var fs = require('fs');
var logged = [];
var enabled = {global: true, channels: []};
function log(content, channel, format){
	if (enabled.global == false) return;
	if (enabled.channels[channel] == false) return;
	var now = new Date();
	var date = now.getDay() + '-' + now.getMonth() + '-' + now.getFullYear();
	var folder = 'plugins/logs/';
	var filename = folder + channel + '-' + date + '.txt';
	var original_content = content;
	if(!logged[channel]){
		logged[channel] = [];
	}
	if(logged && !logged[channel][date]){
		content = 'Started logging at: ' + date + '\n' + content;
		logged[channel][date] = date;
	}
	content += '\n';
	fs.appendFile(filename, content, function(err) {
		if(err) {
			throw err;
		}else{
			console.log((format ? format : '') + original_content + Format.RESET);
		}
	}); 
}
exports.init = function(plugins, bot){
	bot.addCommand('log', 'on/off [channel]', 'Enables/disables logging', USER_LEVEL_OWNER);
	plugins.listen('Log', 'topic', function(args){
		log('[TOPIC] '+args.topic, args.channel, Color.MAGENTA);
	});
	plugins.listen('Log', 'command', function(args){
		log('[COM] ['+args.channel+'] '+args.user+' ran command: '+args.command, args.channel, Format.BOLD + Color.RED);
		if(args.command == 'log'){
			var level = bot.getUserLevel(args.user, args.host);
			if(!bot.isCommand(args.command, level)){
				return;
			}

			if(args.arguments && args.arguments[1]){
				var channel = args.arguments[1];
			}
			if(args.arguments && args.arguments[0]){
				switch(args.arguments[0]){
					case 'on':
						if(!channel){
							enabled.global = true;
							IRC.message(args.channel, 'Logging enabled');
						}else{
							enabled.channels[channel] = true;
							IRC.message(args.channel, 'Logging enabled for '+channel);
						}
					break;
					case 'off':
						if(!channel){
							enabled.global = false;
							IRC.message(args.channel, 'Logging disabled');
						}else{
							enabled.channels[channel] = false
							IRC.message(args.channel, 'Logging disabled for '+channel);
						}
					break;
				}
			}
		}
	});
	plugins.listen('Log', 'message', function(args){
		log('[MSG] ['+args.channel+'] '+args.user+' said: '+args.message, args.channel, Color.GREEN);
	});
	plugins.listen('Log', 'join', function(args){
		log('[JOIN] ['+args.channel+'] '+args.user, args.channel, Color.CYAN);
	});
	plugins.listen('Log', 'part', function(args){
		log('[PART] ['+args.channel+'] '+args.user, args.channel, Color.CYAN);
	});
};
