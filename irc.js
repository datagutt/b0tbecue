var util = require('util');
var net = require('net');
var IRC = function(bot, plugins){
	this.bot = bot;
	this.plugins = plugins;
	this.floodDelay = this.minFloodDelay;
};
IRC.prototype = {
	minFloodDelay: 250,
	maxFloodDelay: 500,
	floodDelay: 0,
	lastMessageTime: 0,
	socket: new net.Socket(),
	channels: [],
	users: [],
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
				self.nick(bot.config.nick);
				// Cool hack for repeating strings
				self.send('USER', new Array(5).join(bot.config.name + ' '));
				if(bot.config.password){
					self.send('NS IDENTIFY', bot.config.password);
				}
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
		var socket = this.socket;
		var self = this;
		var time = new Date().getTime();
		if (this.lastMessageTime + this.floodDelay > time){
			setTimeout(function(){
				socket.write(action + ' ' + message + '\r\n');
			}, this.lastMessageTime + this.floodDelay - time);
			this.lastMessageTime += this.floodDelay;
			this.floodDelay = Math.min(this.floodDelay + 50, this.maxFloodDelay);
		} else {
			if (time - this.lastMessageTime > this.floodDelay * 2) {
				this.floodDelay = this.minFloodDelay;
			}
			socket.write(action + ' ' + message + '\r\n');
			this.lastMessageTime = time;
		}
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
			console.log('[PING] Received');
			this.handlePing(response);
		}else{
			var passedVars = {};
			for (i = response.length; i--;){
					// Turn the response into an array
					var rawResponse = response[i].split(' ');
					// Get host and user using regex
					var hostmask = /(.*)!((.*)@(.*))/.exec(rawResponse[0]);
					if(hostmask && hostmask[1] && hostmask[2]){
						// Some times, theres a : infront of user
						passedVars['user'] = hostmask[1].replace(/^:/, '');
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

						passedVars['message'] = message;

						// get the first part of a message
						first = message.split(' ')[0];
						if(self.bot.config.prefix && first.match(self.bot.config.prefix)){
							// Remove the prefix from command
							passedVars['command'] = first.replace(self.bot.config.prefix, '');
							// Slice using the prefix length+command length
							// so the command doesnt appear in the arguments list
							// then split it so it becomes an array
							passedVars['arguments'] = message.slice(self.bot.config.prefix.length+first.length).split(' ');
						}
					}
					if(event == 'TOPIC'){
						// Same as message parsing
						var topic = rawResponse.slice(3).join(' ').replace(/^:/, '').trim();
						passedVars['topic'] = topic;
					}
					// Userlist recieved when joining channel
					if(event == '353'){
						var users = rawResponse.slice(5);	
						var channel = rawResponse[4], passed_users = [];
						[].forEach.call(users, function(user){
							// Remove modes and :
							user = user.replace(/^[^A-}]+/, '').replace(/^:/, '').trim();
							// Make sure it ignores the name of the bot
							if(user !== self.bot.config.nick){
								passed_users[user] = user;
							}
						});
						this.users[channel] = passed_users;
					}
				if(event){
					self.fireEvent(event, passedVars);
				}
			}
		}
	},
	handlePing: function(data){
		var server = data[0].split(":");
		server = server[1].trim();
		console.log('[PONG] '+server);
		this.send('PONG', server);
	},
	fireEvent: function(event, passedVars){
		switch(event){
			case 'JOIN':
				// Ignore the bot
				if(passedVars.user !== this.bot.config.nick){
					this.users[passedVars.channel][passedVars.user] = passedVars.user;
				}
			break;
			case 'PART':
				this.users[passedVars.channel][passedVars.user] = undefined;
			break;
			case 'PRIVMSG':
				if(passedVars['command']){
					event = 'command';
				}else if(passedVars['message']){
					event = 'message';
				}
			break;
		}
		this.plugins.fire(event.toLowerCase(), passedVars);
	},
	disconnect: function(){
		console.log('Disconnected.');
		this.socket.end();
	},
	/* Channel methods */
	join: function(channel){
		this.channels[channel] = channel;
		this.users[channel] = [];
		this.send('JOIN', channel);
	},
	part: function(channel){
		this.channels[channel] = undefined;
		this.users[channel] = undefined;
		this.send('PART', channel);
	},
	nick: function(nick){
		this.send("NICK", nick);
	},
	topic: function(channel, topic){
		this.send('TOPIC', channel + ' :' + topic);
	},
	op: function(channel, user){
		this.send('MODE',  channel + ' +o ' + user);
	},
	deop: function(channel, user){
		this.send('MODE', channel + ' -o ' + user);
	},
	kick: function(channel, user, message){
		if(!message){
			message = 'Your behavior is not conducive to the desired environment.';
		}
		this.send('KICK', channel + ' ' + user + ' :' + message);
	},
	ban: function(channel, user){
		this.send('MODE',  channel + ' +b ' + user);
	},
	unban: function(channel, user){
		this.send('MODE',  channel + ' -b ' + user);
	},
	voice: function(channel, user){
		this.send('MODE',  channel + ' +v ' + user);
	},
	unvoice: function(channel, user){
		this.send('MODE',  channel + ' -v ' + user);
	},
	mute: function(channel, user){
		this.send('MODE',  channel + ' +q ' + user);
	},
	unmute: function(channel, user){
		this.send('MODE',  channel + ' -q ' + user);
	},
	message: function(target, message){
		var self = this;

		var messages = message.split("\n");
		[].forEach.call(messages, function(message){
			self.send('PRIVMSG', target + ' :' + message);
		});
	}
};
exports.IRC = IRC;
