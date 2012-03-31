var util = require('util');
var net = require('net');
function evaluate(code){
	try{
		eval('(' + code + ')\n');
	}catch(e){
		this.message('#kickfight', e);
	}
}
var IRC = function(bot){
	this.bot = bot;
};
IRC.prototype = {
	socket: new net.Socket(),
	config: {
		server: 'irc.freenode.net',
		port: 6667,
		nick: 'exampleb0t',
		channels: ['#b0tbecue']
	},
	connect: function(server, port){
		var config = this.config;
		var bot = this.bot;
		var socket = this.socket;
		var self = this;
		socket.on('connect', function() {
			console.log('Connected to '+server+':'+port);
			setTimeout(function(){
				self.send('NICK', bot.config.nick);
				// Cool hack for repeating strings
				self.send('USER', new Array(5).join(bot.config.name + ' '));
				[].forEach.call(config.channels, function(channel){
					self.join(channel);
				});
			}, 1000);
		});
		socket.on('data', function(data){
			self.parse(data, self);
		});
		socket.setEncoding('ascii');
		socket.setNoDelay();
		socket.connect(port, server);
	},
	send: function(action, message){
		this.socket.write(action + ' ' + message + '\r\n');
	},
	parse: function(data, self){
		// IRC seems to put a : infront of lines, remove that
		var data = data.toString().replace(/^:/, '');
		var response = data.split('\n'), 
			rawResponse, 
			hostname, 
			message, 
			event;
		// Pings should later on be handled in fireEvent
		if(data.match('^PING')){
			console.log('[PING] Receieved');
			this.handlePing(response);
		}else{
			var passedVars = {};
			for (i = response.length; i--;){
					// Turn the response into an array
					var rawResponse = response[i].split(' ');
					// Get host and user using regex
					var hostmask = /(.*)!((.*)@(.*))/.exec(rawResponse[0]);
					if(hostmask && hostmask[1] && hostmask[2]){
						passedVars['user'] = hostmask[1];
						passedVars['host'] = hostmask[2];
					}
					// Get event
					if(rawResponse[1]){
						passedVars['event'] = event = rawResponse[1];
					}
					// Get channel
					if(rawResponse[2]){
						var channel = rawResponse[2].replace(/^:/, '').trim();
						// If it has # infront of it, it gotta be a channel
						if(/(#(.*))/.exec(channel)){
							passedVars['channel'] = channel;
						}
					}
					if(event == 'PRIVMSG'){
						// Remove the 3 first parts because they dont 
						// contain a message, then join the values left
						// and remove : infront to get a string
						message = rawResponse.slice(3).join(' ').replace(/^:/, '').trim();
						// get the first part of a message
						first = message.split(' ')[0];
						if(self.bot.config.prefix && first.match(self.bot.config.prefix)){
							// Remove the prefix from command
							passedVars['command'] = first.replace(self.bot.config.prefix, '');
							// Slice using the prefix length+command length
							// so the command doesnt appear in the arguments list
							passedVars['arguments'] = message.slice(self.bot.config.prefix.length+first.length);
					}
					passedVars['message'] = message;
				}
				console.log(passedVars);
				if(event){
					self.fireEvent(event, passedVars);
				}
			}
		}
	},
	handlePing: function(data){
		var server = data[0].split(":");
		server = server[1].trim();
		console.log('[PONG] '+server)
		this.send('PONG', server);
	},
	fireEvent: function(event, passedVars){
		switch(event){
			case 'PING':
				// PING is handled elsewhere
			break;
			case 'PRIVMSG':
				if(passedVars['command']){
					event = 'command';
					// temp
					this.checkCommand(passedVars);
				}else if(passedVars['message']){
					console.log('[MSG] ['+passedVars['user']+']'+passedVars['message']);
					event = 'message';
				}
			break;
		}
	},
	checkCommand: function(passedVars){
		// Remove this, add plugins instead
		var channel = passedVars['channel'];
		switch(passedVars['command']){
			case 'help':
				this.message(channel, passedVars['user'] + ': You need help, dont you?');
			break;
			case 'ping':
				this.message(channel, 'Version: '+this.bot.VERSION);
			break;
			case 'eval':
				code = passedVars['message'].replace(this.bot.config.prefix+"eval", "");
				if(this.isOwner(passedVars['user'], passedVars['host'])){
					result = evaluate.apply(this, [code]);
					if(result){
						this.message(channel, result);
					}
				}else{
					this.message(channel, 'Your not my owner!');
				}
			break;
		}
	},
	isOwner: function(user, host){
		var config = this.bot.config;
		for(owner in config.owners){
			return user == owner && config.owners[owner] == host;
		}
	},
	/* Channel methods */
	join: function(channel){
		this.send('JOIN', channel);
	},
	part: function(channel){
		this.part('JOIN', channel);
	},
	message: function(target, message){
		this.send('PRIVMSG', target + ' :' + message);
	}
};
module.exports.IRC = IRC;