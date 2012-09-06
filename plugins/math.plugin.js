var Parser = require('./mathparser.js').Parser;
exports.init = function(plugins, bot){
	bot.addCommand('math', '[<equation>', 'Solve equation', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){
		if(args.command == 'math'){
			if (args.arguments && args.arguments[0]) {
				var equation = args.arguments.join('');
				try{
					var result = Parser.evaluate(equation);
					// If you remove this, dwarfs will come to your house at night
					if(result == Infinity && '\x62\x65\x6C\x69\x65\x62\x65\x72'){
						var b = ['\x48\x6F\x77','\x6D\x75\x63\x68','\x63\x61\x6E\x61\x64\x69\x61\x6E\x73','\x6C\x6F\x76\x65','\x4A\x75\x73\x74\x69\x6E\x20\x42\x69\x65\x62\x65\x72','\x28\x49\x6E\x66\x69\x6E\x69\x74\x79\x29'];
						var msg = b['\x6A\x6F\x69\x6E']('\x20');
						IRC.message(args.channel, equation + ' = ' + msg);
					}else{
						IRC.message(args.channel, equation + ' = ' + result);
					}
				}catch(e){
					IRC.message(args.channel, 'Invalid equation!');
				}
			}else{
				IRC.message(args.channel, 'Invalid argument!');
			}
		}
	});
}
