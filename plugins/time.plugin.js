var time = require('time');
exports.init = function(plugins, bot){
	bot.addCommand('time', '[<country> <city>]', 'Show time in location', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){
		var currentTime = new time.Date();
		if(args.command == 'time'){
			if (args.arguments && args.arguments[0] && args.arguments[1]) {
				var country = args.arguments[0];
				var city = args.arguments[1];
				
				try{
					currentTime.setTimezone(country + '/' + city);
				}catch(e){
					IRC.message(args.channel, args.user + ': Either you used an invalid country or city or you live in the middle of nowhere.').
					return;
				}
	
				var hours = currentTime.getHours();
				var minutes = currentTime.getMinutes();
				var seconds = currentTime.getSeconds();
				
				if (minutes < 10){
					minutes = '0' + minutes;
				}
				
				IRC.message(args.channel, hours + ':' + minutes + ':' + seconds);
			}else{
				IRC.message(args.channel, 'Invalid argument!');
			}
		}
	});
}
