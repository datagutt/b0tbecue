var WebSocketServer = require('websocket').server;
var http = require('http'), fs = require('fs');
var Control = function(){

};
Control.save = function(bot, data){
	if(data && data.action){
		switch(data.action){
			case 'stop':
				IRC.disconnect();
				console.log('Stopping bot');
				process.exit(0);
			break;
			case 'restart':
				// This only reconnects, it does not reload plugins (yet!)
				IRC.disconnect();
				// Without a timeout, you will get an AssertionError
				setTimeout(bot.run, 1000);
			break;
			case 'say':
				if(data.channel && data.text){
					IRC.message(data.channel, data.text);
				}
			break;
			case 'join':
				if(data.text){
					IRC.join(data.text);
				}
			break;
			case 'part':
				if(data.text){
					IRC.part(data.text);
				}
			break;
			case 'op':
				if(data.channel && data.text){
					IRC.op(data.channel, data.text);
				}
			break;
			case 'deop':
				if(data.channel && data.text){
					IRC.deop(data.channel, data.text);
				}
			break;
			case 'nick':
				if(data.text){
					IRC.nick(data.text);
				}
			break;
			case 'raw':
				// This is uhm, not a good way to use the send function
				if(data.text){
					IRC.send(data.text, '');
				}
			break;
			case 'skynet':
				// Value must contain sekrit password
				if(data.text && data.channel && data.text == config.skynet_password){
					var users = IRC.users[data.channel];
					for(user in users){
						IRC.kick(data.channel, users[user], 'You will not be given a second chance. You cannot save John Connor!');
					}
				}
			break;
		}
	}
}
Control.start = function(self, bot){
	var host = self.config.host, port = self.config.port;
	var server = http.createServer(function(request, response) {
		var url = 'plugins/control/', plugins = [];
		request.url = request.url.replace('/', '');
		switch(request.url){
			case 'index.html':
			case '':
				var plugin_list = '', channel_list = '', user_list = '';
				url += 'interface.html';
				for(plugin in Plugins.plugins){
					plugin_list += '<li>'+plugin+'</li>\n';
				};
				for(channel in IRC.channels){
					channel_list += '<option value="'+IRC.channels[channel]+'">'+IRC.channels[channel]+'</option>\n';
				};
				for(channel in IRC.users){
					user_list += '<h4>'+channel+'</h4><ul>\n';
					for(user in IRC.users[channel]){
						user_list += '<li>'+IRC.users[channel][user]+'</h4>\n';
					}
					user_list += '</ul>\n';
				};
			break;
			case 'js/N1.min.js':
				url += '/js/N1.min.js';
			break;
			default:
				url += '404.html';
			break;
		}
		fs.readFile(url, 'utf8', function(err, data) {
		    if(err){
		    	response.writeHead(500);
    			response.end();
		    	return false;
		    }
		    response.writeHead(200);
		    if(plugin_list){
		    	data = data.replace('%plugins%', plugin_list);
		    }
			if(channel_list){
				data = data.replace('%channels%', channel_list);
			}
			if(user_list){
				data = data.replace('%users%', user_list);
			}
			response.end(data);
		});
	});
	server.listen(port, host);
	wsServer = new WebSocketServer({
	    httpServer: server
	});
	wsServer.on('request', function(request) {
		var connection = request.accept(null, request.origin);
		connection.on('message', function(message) {
			var data = JSON.parse(message.utf8Data);
			if (message.type === 'utf8') {
				if(data.controlpw && data.controlpw == self.config.password){
					Control.save(bot, data);
				}else{
					connection.send('wrongpw');
				}
			}
    	});
    	connection.on('close', function(connection) {
		});
	});
};
exports.init = function(plugins, bot){
	Control.start(this, bot);
};
