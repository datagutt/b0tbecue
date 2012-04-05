// put other functions and such here, but add a hook in init
var util = require('util');
var vm = require('vm')
function evaluate(code, channel){
	try{
		return eval(code);
	}catch(e){
		IRC.message(channel, e);
	}
}
var helpCommand = function(bot, args){
	var message = '';
	for(command in bot.commands){
		var com = bot.commands[command];
		if(!com.hidden && bot.getUserLevel(args.user, args.host) >= com.level){
			message += bot.config.prefix + command + ' ';
		}
	}
	IRC.message(args.channel, 'Commands: ' + message);
};
exports.init = function(plugins, bot){
	bot.addCommand('help', '[<command>]', 'Shows commands and how to use them', USER_LEVEL_GLOBAL);
	bot.addCommand('userlevel', '[<user>] [<host>]', 'Shows the level of the user', USER_LEVEL_GLOBAL);
	bot.addCommand('ping', '', 'Shows some info about the bot', USER_LEVEL_GLOBAL, true);
	bot.addCommand('eval', '<code>', 'Executes the code', USER_LEVEL_OWNER);
	bot.addCommand('owners', '<type>', 'Shows owners', USER_LEVEL_MOD);
	bot.addCommand('admins', '<type>', 'Shows admins', USER_LEVEL_MOD);
	bot.addCommand('mods', '<type>', 'Shows mods', USER_LEVEL_MOD);
	plugins.listen('Base', 'command', function(args){	
		var level = bot.getUserLevel(args.user, args.host);
		if(!bot.isCommand(args.command, USER_LEVEL_OWNER)){
			IRC.message(args.channel, args.user + ': Command doesnt not exist!');
			return;
		}
		if(bot.getCommandMinimumLevel(args.command) > level){
			IRC.message(args.channel, args.user + ': You are not allowed to run that command!');
			return;
		}
		switch(args.command){
			case 'help':
				if(args.arguments && args.arguments[0]){
					var com = bot.commands[args.arguments[0]], usage;
					if(com && com.name){
						if(com.usage){
							usage = bot.config.prefix + com.name + ' ' + com.usage;
							IRC.message(args.channel, 'Usage: ' + usage);
						}
						if(com.description){
							IRC.message(args.channel, 'Description: ' + com.description);
						}
					}else{
						IRC.message(args.channel, 'Command does not exist');
					}
				}else{
					helpCommand(bot, args);
				}
			break;
			case 'ping':
				IRC.message(args.channel, 'Version: '+bot.VERSION + ', source at: https://github.com/datagutt/b0tbecue');
			break;
			case 'userlevel':
				var user, level;
				if(args.arguments && args.arguments[0] && args.arguments[1]){
					user = args.arguments[0];
					host = args.arguments[1];
				}else{
					user = args.user;
					host = args.host;
				}
				level = bot.getUserLevel(user, host);
				IRC.message(args.channel, user + ' has userlevel ' + level);
			break;
			case 'eval':
				code = args.arguments.join(' ');
				evaluated = evaluate.apply(this, [code, args.channel]);
				result = evaluated ? util.inspect(evaluated) : false;
				if(result){
					IRC.message(args.channel, result);
				}
			break;
			case 'owners':
				if(args.arguments && args.arguments[0]){
					type = args.arguments[0];
					if(level < USER_LEVEL_OWNER){
						IRC.message(args.channel, 'You dont have permission to change this!');
						return;
					}
					switch(type){
						case 'add':
							if(args.arguments[1] && args.arguments[2]){
								var user = args.arguments[1];
								var host = args.arguments[2];
								bot.config.owners[user] = host;
								IRC.message(args.channel, 'User ' + user + ' got added as owner.');
							}
						break;
						case 'remove':
							if(args.arguments[1]){
								var user = args.arguments[1];
								delete bot.config.owners[user];
								IRC.message(args.channel, 'User ' + user + ' got removed as owner.');
							}
						break;
					}
					db.levels.save({owners: bot.config.owners});
				}else{
					msg = '';
					for(owner in bot.config.owners){
						msg += owner + ' ';
					}
					IRC.message(args.channel, 'Owners: ' + msg);
				}
			break;
			case 'admins':
				if(args.arguments && args.arguments[0]){
					type = args.arguments[0];
					if(level < USER_LEVEL_ADMIN){
						IRC.message(args.channel, 'You dont have permission to change this!');
						return;
					}
					switch(type){
						case 'add':
							if(args.arguments[1] && args.arguments[2]){
								var user = args.arguments[1];
								var host = args.arguments[2];
								bot.config.admins[user] = host;
								IRC.message(args.channel, 'User ' + user + ' got added as admin.');
							}
						break;
						case 'remove':
							if(args.arguments[1]){
								var user = args.arguments[1];
								delete bot.config.admins[user];
								IRC.message(args.channel, 'User ' + user + ' got removed as admin.');
							}
						break;
					}
					db.levels.save({admins: bot.config.admins});
				}else{
					msg = '';
					for(admin in bot.config.admins){
						msg += admin + ' ';
					}
					IRC.message(args.channel, 'Admins: ' + msg);
				}
			break;
			case 'mods':
				if(args.arguments && args.arguments[0]){
					type = args.arguments[0];
					if(level < USER_LEVEL_MOD){
						IRC.message(args.channel, 'You dont have permission to change this!');
						return;
					}
					switch(type){
						case 'add':
							if(args.arguments[1] && args.arguments[2]){
								var user = args.arguments[1];
								var host = args.arguments[2];
								bot.config.mods[user] = host;
								IRC.message(args.channel, 'User ' + user + ' got added as mod.');
							}
						break;
						case 'remove':
							if(args.arguments[1]){
								var user = args.arguments[1];
								delete bot.config.mods[user];
								IRC.message(args.channel, 'User ' + user + ' got removed as mod.');
							}
						break;
					}
					db.levels.save({mods: bot.config.mods});
				}else{
					msg = '';
					for(mod in bot.config.mods){
						msg += mod + ' ';
					}
					IRC.message(args.channel, 'Mods: ' + msg);
				}
			break;
		}
	});
}
