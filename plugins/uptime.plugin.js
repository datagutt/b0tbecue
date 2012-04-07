var parse = function(uptime){
	var minutes = Math.round(uptime / 60) % 60;
	var hours = Math.round(uptime / 60 / 60) % 24;
	var days = Math.round(uptime / 60 / 60 / 24);
	var seconds = Math.round(uptime) % 60;
	
	uptime = [];
	if (days >= 1) {
		uptime.push('' + days + ' day' + (days > 1 ? 's' : ''));
	}
	if (hours >= 1) {
		uptime.push('' + hours +' hour' + (hours > 1 ? 's' : ''));
	}
	if (minutes >= 1) {
		uptime.push('' + minutes + ' minute' + (minutes > 1 ? 's' : ''));
	}
	if (seconds >= 1) {
		uptime.push('' + seconds + ' second' + (seconds > 1 ? 's' : ''));
	}
	uptime = uptime.join(', ');
	return uptime;
}
var uptime = function(bot, channel){
	var parsed = (new Date().getTime() - bot.startTime) / 1000;
	IRC.message(channel, 'Bot has been online for: ' + parse(parsed));
}
exports.init = function(plugins, bot){
	bot.addCommand('uptime', '', 'Shows uptime of bot', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){
		if(args.command && args.command == 'uptime'){
			uptime(bot, args.channel);
		}
	});
}