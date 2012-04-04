exports.init = function(plugins, bot){
	bot.addCommand('say', '[<channel>] [<message>]', 'Says message to channel', USER_LEVEL_ADMIN);
	bot.addCommand('unban', '[<user>]', 'Unbans user', USER_LEVEL_ADMIN);
	bot.addCommand('join', '[<channel>]', 'Joins channel', USER_LEVEL_ADMIN);
	bot.addCommand('part', '[<channel>]', 'Parts channel', USER_LEVEL_ADMIN);
	bot.addCommand('kick', '[<user>]', 'Kicks user from channel', USER_LEVEL_MOD);
	bot.addCommand('kickban', '[<user>]', 'Kick and bans user from channel', USER_LEVEL_MOD);
	bot.addCommand('unban', '[<user>]', 'Unbans user', USER_LEVEL_ADMIN);
	bot.addCommand('op', '[<user>]', 'Gives operator status to user', USER_LEVEL_MOD);
	bot.addCommand('deop', '[<user>]', 'Remove operator status from user', USER_LEVEL_MOD);
	bot.addCommand('topic', '[<topic>]', 'Sets the topic of current channel', USER_LEVEL_MOD);
	bot.addCommand('nick', '[<nick>]', 'Changes nick of bot', USER_LEVEL_OWNER);
	plugins.listen('OP', 'command', function(args){
		switch(args.command){
			case 'say':
				if(args.arguments && args.arguments[0]){
					// Join all arguments to one message, but remove first argument
					var message = args.arguments.join(' ').replace(args.arguments[0], '');
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
					IRC.kick(args.channel, args.arguments[0]);
				}
			break;
			case 'kickban':
				if(args.arguments && args.arguments[0]){
					IRC.ban(args.channel, args.arguments[0]);
					// Get user from hostname
					IRC.kick(args.channel, args.arguments[0].split('!')[0]);
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

		}
	});
}