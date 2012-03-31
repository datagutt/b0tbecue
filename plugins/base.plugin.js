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
exports.init = function(bot){
	bot.listen('Base', 'command', function(args){
	console.log(args);
		switch(args.command){
			case 'help':
				IRC.message(args.channel, 'I wish i could help… but this command aint coded yet…');
			break;
			case 'ping':
				IRC.message(args.channel, 'Version: '+this.bot.VERSION);
			break;
			case 'eval':
				code = args.arguments.join(' ');
				if(IRC.isOwner(args.user, args.host)){
					evaluated = evaluate.apply(this, [code, args.channel]);
					result = evaluated ? util.inspect(evaluated) : false;
					if(result){
						IRC.message(args.channel, result);
					}
				}else{
					IRC.message(args.channel, 'Your not my owner!');
				}
			break;
		}
	});
}