exports.init = function(plugins, bot){
	bot.addCommand('wolfram', '<question>', 'Answer question using wolfram alpha', USER_LEVEL_GLOBAL);
	console.log(this);
	if(this.config.client){
		var wolfram = require('wolfram').createClient(this.config.client);
	}else{
		throw new Error('No application id specified!');
	}
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'wolfram':
				if(args && args.arguments){
					var query = args.arguments.join(' ');
					wolfram.query(query, function(err, result){
						if(result && result.length > 0){
							//for(a in result){
							//	b = result[a];
							//	for(c in b){
							//		console.log(b[c]);
							//	}
							//}
							IRC.message(args.channel, result[1]['subpods'][0]['value']);
						}else{
							IRC.message(args.channel, 'Wolfram error.');
						}
					});
				}else{
					IRC.message(args.channel, 'Not enough arguments!');
				}
			break;
		}
	});
};
