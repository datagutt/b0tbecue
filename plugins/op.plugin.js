exports.init = function(plugins, bot){
	bot.addCommand('say', '[<channel>] [<message>]', 'Says message to channel', USER_LEVEL_ADMIN);
	bot.addCommand('unban', '[<user>]', 'Unbans user', USER_LEVEL_ADMIN);
	bot.addCommand('join', '[<channel>]', 'Joins channel', USER_LEVEL_ADMIN);
	bot.addCommand('part', '[<channel>]', 'Parts channel', USER_LEVEL_ADMIN);
	bot.addCommand('kick', '[<user>] [<message>]', 'Kicks user from channel', USER_LEVEL_MOD);
	bot.addCommand('kickban', '[<user>] [<message>]', 'Kick and bans user from channel', USER_LEVEL_MOD);
	bot.addCommand('unban', '[<user>]', 'Unbans user', USER_LEVEL_ADMIN);
	bot.addCommand('op', '[<user>]', 'Gives operator status to user', USER_LEVEL_MOD);
	bot.addCommand('deop', '[<user>]', 'Remove operator status from user', USER_LEVEL_MOD);
	bot.addCommand('topic', '[<topic>]', 'Sets the topic of current channel', USER_LEVEL_MOD);
	bot.addCommand('nick', '[<nick>]', 'Changes nick of bot', USER_LEVEL_OWNER);
	bot.addCommand('changePrefix', '[<nick>]', 'Changes prefix of bot', USER_LEVEL_OWNER);
	plugins.listen('OP', 'command', function(args){
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
				}
			break;
			case 'kick':
				if(args.arguments && args.arguments[0]){
					IRC.kick(args.channel, args.arguments[0], message);
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
				}
			break;
			case 'op':
				if(args.arguments && args.arguments[0]){
					IRC.op(args.channel, args.arguments[0]);
				}
			break;
			case 'deop':
				if(args.arguments && args.arguments[0]){
					IRC.deop(args.channel, args.arguments[0]);
				}
			break;
			case 'nick':
				if(args.arguments && args.arguments[0]){
					IRC.nick(args.arguments[0]);
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
				}
			break;
			case 'demute':
				if(args.arguments && args.arguments[0]){
					IRC.demute(args.channel, args.arguments[0]);
				}
			break;
			case 'voice':
				if(args.arguments && args.arguments[0]){
					IRC.voice(args.channel, args.arguments[0]);
				}
			break;
			case 'devoice':
				if(args.arguments && args.arguments[0]){
					IRC.devoice(args.channel, args.arguments[0]);
				}
			break;
			case 'changePrefix':
				if(args.arguments && args.arguments[0]){
					bot.config.prefix = args.arguments[0];
					IRC.message(args.channel, 'Prefix change to ' + bot.config.prefix);
				}
			break;
		}
	});
}