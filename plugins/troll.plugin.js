exports.init = function(plugins, bot){
	bot.addCommand('dood', '[<user>]', 'What up dood', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){
		if(args.command == 'dood'){
			var dood = "what up dood";
			if (args.arguments && args.arguments[0]) {
				dood = args.arguments[0] + ": " + dood;
			}
			IRC.message(args.channel, dood);;
		}
	});
}
