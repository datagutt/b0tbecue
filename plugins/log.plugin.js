var fs = require('fs');
var logged = [];
var enabled = {global: true, channels: []};
function log(content, channel){
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
		logged[date] = date;
	}
	content += '\n';
	fs.appendFile(filename, content, function(err) {
		if(err) {
			throw err;
		}else{
			console.log(original_content);
		}
	}); 
}
exports.init = function(plugins, bot){
	bot.addCommand('log', 'on/off [channel]', 'Enables/disables logging', USER_LEVEL_OWNER);
	plugins.listen('Log', 'topic', function(args){
		log('[TOPIC] '+args.topic, args.channel);
	});
	plugins.listen('Log', 'command', function(args){
		log('[COM] ['+args.channel+'] '+args.user+' ran command: '+args.command, args.channel);
		if(args.command == 'log'){
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
		log('[MSG] ['+args.channel+'] '+args.user+' said: '+args.message, args.channel);
	});
	plugins.listen('Log', 'join', function(args){
		log('[JOIN] ['+args.channel+'] '+args.user, args.channel);
	});
	plugins.listen('Log', 'part', function(args){
		log('[PART] ['+args.channel+'] '+args.user, args.channel);
	});
};
