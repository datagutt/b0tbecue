var dns = require('dns');
var net = require('net');
var geoip = require('geoip-lite');

exports.init = function(plugins, bot){
	bot.addCommand('geo', '[user/host] <user/host/ip>', 'Gives the location of the user, host or ip', USER_LEVEL_GLOBAL);
	plugins.listen(this, 'command', function(args){	
		switch(args.command){
			case 'geo':
				if(args.arguments && args.arguments[0] && args.arguments[1]){
					var lookup = args.arguments[1];
					switch(args.arguments[0]){
						case 'user':
							IRC.message(args.channel, 'Resolving hostname for '+lookup);
							IRC.request('USERHOST', lookup, '302', function(requestArgs){
								if(!requestArgs.hostmask){
									IRC.message(args.channel, 'Error resolving hostname for '+lookup);
									return;
								}
								if(net.isIP(requestArgs.hostmask.split('@')[1])){
									var geo = geoip.lookup(requestArgs.hostmask.split('@')[1]);
									IRC.message(args.channel, JSON.stringify(geo));
								}else{
									IRC.message(args.channel, 'Resolving ip for '+requestArgs.hostmask);
									dns.resolve4(requestArgs.hostmask.split('@')[1], function(err, addresses){
										if (err) {
											IRC.message(args.channel, 'Error resolving ip for '+requestArgs.hostmask.split('@')[1]);
											return;
										}
										var geo = geoip.lookup(addresses[0]);
										IRC.message(args.channel, JSON.stringify(geo));
									});
								}
							});
						break;
						case 'host':
							if(net.isIP(lookup)){
								var geo = geoip.lookup(lookup);
								IRC.message(args.channel, JSON.stringify(geo));
							}else{
								IRC.message(args.channel, 'Resolving ip for '+lookup);
								dns.resolve4(lookup, function(err, addresses){
									if (err) {
										IRC.message(args.channel, 'Error resolving ip for '+lookup);
										return;
									}
									var geo = geoip.lookup(addresses[0]);
									IRC.message(args.channel, JSON.stringify(geo));
								});
							}
						break;
					}
				}
			break;
		}
	});
}
