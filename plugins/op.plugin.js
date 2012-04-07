var config = {autoOP: true}
exports.init = function(plugins, bot){
	var self = this;
	bot.addCommand('say', '[<channel>] [<message>]', 'Says message to channel', USER_LEVEL_ADMIN);
	bot.addCommand('join', '[<channel>]', 'Joins channel', USER_LEVEL_ADMIN, false, true);
	bot.addCommand('part', '[<channel>]', 'Parts channel', USER_LEVEL_ADMIN, false, true);
	bot.addCommand('kick', '[<user>] [<message>]', 'Kicks user from channel', USER_LEVEL_MOD, false, true);
	bot.addCommand('kickban', '[<user>] [<message>]', 'Kick and bans user from channel', USER_LEVEL_MOD, false, true);
	bot.addCommand('unban', '[<user>]', 'Unbans user', USER_LEVEL_ADMIN, false, true);
	bot.addCommand('op', '[<user>]', 'Gives operator status to user', USER_LEVEL_MOD, false, true);
	bot.addCommand('deop', '[<user>]', 'Remove operator status from user', USER_LEVEL_MOD, false, true);
	bot.addCommand('voice', '[<user>]', 'Gives voice status to user', USER_LEVEL_MOD, false, true);
	bot.addCommand('devoice', '[<user>]', 'Remove voice status from user', USER_LEVEL_MOD, false, true);
	bot.addCommand('mute', '[<user>]', 'Mutes user', USER_LEVEL_MOD, false, true);
	bot.addCommand('unmute', '[<user>]', 'Unmutes user', USER_LEVEL_MOD, false, true);
	bot.addCommand('topic', '[<topic>]', 'Sets the topic of current channel', USER_LEVEL_MOD);
	bot.addCommand('autoOP', '[on|off]', 'AutoOP on/off', USER_LEVEL_OWNER);
	plugins.listen('OP', 'join', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		if(self.config.autoOP){
			if(level >= USER_LEVEL_MOD){
				IRC.op(args.channel, args.user);
			}
		}
	});
	plugins.listen(this, 'command', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		var message = args.message.replace(bot.config.prefix+args.command, '')
			.replace(args.arguments[0], '')
			.trim();
		if(!bot.isCommand(args.command, level)){
			return;
		}
		switch(args.command){
			case 'say':
				if(args.arguments && args.arguments[0]){
					IRC.message(args.arguments[0], message);
				}
			break;
			case 'join':
				if(args.arguments && args.arguments[0]){
					IRC.join(args.arguments[0]);
				}
			break;
			case 'part':
				if(args.arguments && args.arguments[0]){
					IRC.part(args.arguments[0]);
				}else{
					IRC.part(args.channel);
				}
			break;
			case 'kick':
				if(args.arguments && args.arguments[0]){
					IRC.kick(args.channel, args.arguments[0], message);
				}else{
					IRC.kick(args.channel, args.user, '')
				}
			break;
			case 'kickban':
				if(args.arguments && args.arguments[0]){
					IRC.ban(args.channel, args.arguments[0]);
					// Get user from hostname
					IRC.kick(args.channel, args.arguments[0].split('!')[0], message);
				}
			break;
			case 'unban':
				if(args.arguments && args.arguments[0]){
					IRC.unban(args.channel, args.arguments[0]);
				}else{
					IRC.unban(args.channel, args.user);
				}
			break;
			case 'op':
				if(args.arguments && args.arguments[0]){
					IRC.op(args.channel, args.arguments[0]);
				}else{
					IRC.op(args.channel, args.user);
				}
			break;
			case 'deop':
				if(args.arguments && args.arguments[0]){
					IRC.deop(args.channel, args.arguments[0]);
				}else{
					IRC.op(args.channel, args.user);
				}
			break;
			case 'topic':
				if(args.arguments && args.arguments[0]){
					// Join all arguments to one message
					var topic = args.arguments.join(' ');
					IRC.topic(args.channel, topic);
				}
			break;
			case 'mute':
				if(args.arguments && args.arguments[0]){
					IRC.mute(args.channel, args.arguments[0]);
				}else{
					IRC.mute(args.channel, args.user);
				}
			break;
			case 'unmute':
				if(args.arguments && args.arguments[0]){
					IRC.unmute(args.channel, args.arguments[0]);
				}else{
					IRC.unmute(args.channel, args.user);
				}
			break;
			case 'voice':
				if(args.arguments && args.arguments[0]){
					IRC.voice(args.channel, args.arguments[0]);
				}else{
					IRC.voice(args.channel, args.user);
				}
			break;
			case 'devoice':
				if(args.arguments && args.arguments[0]){
					IRC.devoice(args.channel, args.arguments[0]);
				}else{
					IRC.devoice(args.channel, args.user);
				}
			break;
			case 'autoOP':
				if(args.arguments && args.arguments[0]){
					self.config.autoOP = args.arguments[0] == 'on' ? true : false;
					var state = self.config.autoOP ? 'on' : 'off';
					IRC.message(args.channel, 'AutoOP value changed to ' + state);
				}
			break;
		}
	});
}
