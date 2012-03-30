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
		var data = data.toString().replace(/^:/, '');
		var response = data.split('\n'), 
			rawResponse, 
			hostname, 
			message, 
			event;
        if(data.match('^PING')){
        	console.log('[PING] Receieved');
        	this.handlePing(response);
        }else{
        	var passedVars = {};
        	for (i = response.length; i--;){
                var rawResponse = response[i].split(' ');
                var hostname = rawResponse[0].split('!');
				if(hostname[0] && hostname[1]){
                	passedVars['user'] = hostname[0];
                	passedVars['hostname'] = hostname[1];
                }
                if(rawResponse[1]){
					passedVars['event'] = event = rawResponse[1];
                }
                if(event == 'PRIVMSG'){
					message = rawResponse.slice(3);
					if(message[0][0] == ':'){
						message[0] = message[0].replace(':', '');
					}
					first = message[0].trim();
					message = message.join(' ').trim();
					if(self.bot.config.prefix && first.match(self.bot.config.prefix)){
						passedVars['command'] = first.replace(self.bot.config.prefix, '');
					}
					passedVars['message'] = message;
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
		switch(passedVars['command']){
			case 'help':
				this.message('#kickfight', passedVars["user"] + ': You need help, dont you?');
			break;
			case 'ping':
				this.message('#kickfight', 'Version: '+this.bot.VERSION);
			break;
			case 'eval':
				vm = require('vm');
				console.log(passedVars);
				code = passedVars['message'].replace(this.bot.config.prefix+"eval", "");
				if(passedVars['user'] == 'datagutt' && passedVars['hostname'] == '~datagutt@unaffiliated/datagutt'){
					result = evaluate.apply(this, [code]);
					if(result){
						this.message('#kickfight', result);
					}
				}else{
					this.message('#kickfight', 'Your not my owner!');
				}
			break;
		}
	},
	/* Channel methods */
	join: function(channel){
		this.send('JOIN', channel);
	},
	part: function(channel){
		this.part('JOIN', channel);
	},
	message: function(channel, message){
		this.send('PRIVMSG', channel + ' :' + message);
	}
};
module.exports.IRC = IRC;