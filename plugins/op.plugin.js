exports.init = function(plugins, bot){
	bot.addCommand('op', '[<user>]', 'Gives operators status to user', USER_LEVEL_ADMIN);
	plugins.listen('OP', 'command', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		if(bot.isCommand(args.command) && !bot.canUseCommand(args.command, level)){
			IRC.message(args.channel, args.user + ': You are not allowed to run that command!');
			return;
		}
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