var nebkatQuotes = ['what\'s up dood',
'ZOMG NEBOJSA IS BACK',
'<codeworkx> YIPIJAHEY SCHWEINEBACKE',
'<xplodwild> see the August whore on my balls',
'<codeworkx> Olympics?  New phone to hack on?',
'<codeworkx> he\'s simply dumb\n<codeworkx> he will always be dumb\n<codeworkx> there is nothing we can do about it',
'<Jiangyi|BF3> Shouldn\'t it be CodeworkxQuote instead? lol\n* nebkat has kicked Jiangyi|BF3 from #teamhacksung-support (idiot)'];
exports.init = function(plugins, bot){
	bot.addCommand('nebkatQuote', '', 'nebkat is the best', USER_LEVEL_GLOBAL, false);
	bot.addCommand('dood', '[<user>]', 'What up dood', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){
		if(args.command == 'dood'){
			var dood = "what up dood";
			if (args.arguments && args.arguments[0]) {
				dood = args.arguments[0] + ": " + dood;
			}
			IRC.message(args.channel, dood);;
		}else if(args.command == 'nebkatQuote') {
			IRC.message(args.channel, nebkatQuotes[Math.floor(Math.random() * nebkatQuotes.length)]);
		}
	});
}
