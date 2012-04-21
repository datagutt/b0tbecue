var timers = [];
exports.init = function(plugins, bot){
	bot.addCommand('timer', 'time action [<value>]', 'Runs a command using a timer', USER_LEVEL_MOD);
	var i = 0;
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'timer':
				switch(args.arguments[0]){
					case 'set':
						if(args.arguments && args.arguments[1] && args.arguments[2]){
							var time = args.arguments[1] * 1000;
							var action = args.arguments[2];
							var value = args.message.split(' ').slice(4);
							args.command = action;
							args.message = bot.config.prefix + args.command + ' ' + value.join(' ');
							args.arguments = value;
							timers[i] = [];
							timers[i].command = args.command;
							timers[i].arguments = args.arguments;
							timers[i].number = i;
							timers[i].action = setTimeout(function(){
								plugins.fire('command', args);
								if(timers[i - 1]){
									timers.splice(i - 1, 1);
								}
							}, time);
							i++;
							IRC.message(args.channel, 'Timer set!');
						}
					break;
					case 'list':
						IRC.message(args.channel, 'Timers:');
						list = '';
						for(timer in timers){
							var timer = timers[timer];
							if(timer){
								list += timer.number + '[' + timer.command + ' ' + (timer.arguments ? timer.arguments.join(' ') : '') + ']\n';
							}
						}
						IRC.message(args.channel, list);
					break;
					case 'cancel':
						if(args.arguments && args.arguments[1]){
							for(timer in timers){
								var timer = timers[timer];
								if(timer.number == args.arguments[1]){
									clearTimeout(timer.action);
									timers.splice(timer.number, 1);
									IRC.message(args.channel, 'Timer cleared!');
								}
							}
						}
					break;
				}
		}
	});
};
