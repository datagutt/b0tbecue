var colors = [
	'red',
	'blue',
	'green',
	'orange',
	'brown'
];
var countdown;
var challenged = '';
var channel = '';
var color;

var explode = function(){
	IRC.message(channel, 'BOOM!');
	IRC.kick(channel, challenged, 'You failed to disarm the bomb! Correct color was ' + color);
	challenged = '';
	channel = '';
	clearInterval(countdown);
}

var disarm = function(){
	IRC.message(channel, 'Bomb disarmed!');
	challenged = '';
	channel = '';
	clearInterval(countdown);
}

exports.init = function(plugins, bot){
	bot.addCommand('bomb', '<user>', 'Bombs a user', USER_LEVEL_ADMIN);
	plugins.listen(this, 'command', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		if(!bot.isCommand(args.command, level)){
			return;
		}
		switch(args.command){
			case 'bomb':
				if(args.arguments && args.arguments[0]){
					if(challenged != ''){
						IRC.message(args.channel, args.user + ': bomb already in progress');
						return;
					}
					challenged = args.arguments[0];
					channel = args.channel;
					color = colors[Math.floor(Math.random()*(colors.length-1))];
					IRC.message(args.channel, challenged + ', you have been challenged!');
					IRC.message(args.channel, 'Answer (' + colors.join(', ') + ') before time runs out!');
					var timer = 10;
					countdown = setInterval(function(){
						IRC.message(args.channel, timer);
						timer--;
						if(timer < 0){
							explode();
						}
					}, 1000);
				}
			break;
		}
	});
	plugins.listen(this, 'message', function(args){
		if(args.user == challenged){
			if(args.message == color){
				IRC.message(channel, 'Correct color!');
				disarm();
			}else{
				IRC.message(channel, 'Wrong color!');
				explode();
			}
		}
	});
	plugins.listen(this, 'nick', function(args){
		if(args.user == challenged) {
			challenged = args.nick;
		}
	});
}
