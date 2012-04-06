var responses = [
	'As I see it, yes.',
	'It is certain.',
	'It is decidedly so.',
	'Most likely.',
	'Outlook good.',
	'Signs point to yes.',
	'Without a doubt.',
	'Yes.',
	'Yes — definitely.',
	'You may rely on it.',
	'Reply hazy. Try again.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don\'t count on it.',
	'My reply is no.',
	'My sources say no.',
	'Outlook not so good.',
	'Very doubtful.'
];
exports.init = function(plugins, bot){
	var l = responses.length;
	bot.addCommand('eightball', '[<question>]', 'Answers your question', USER_LEVEL_GLOBAL);
	// Alternative form, make it hidden so
	// isCommand wont say that the command doesnt exist
	bot.addCommand('8ball', '[<question>]', 'Answers your question', USER_LEVEL_GLOBAL, true);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'eightball':
			case '8ball':
				var response = responses[Math.floor(Math.random()*(l-1))];
				IRC.message(args.channel, response);
			break;
		}
	});
}