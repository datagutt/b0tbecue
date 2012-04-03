var WebSocketServer = require('websocket').server;
var http = require('http'), fs = require('fs');
var host = 'bot.blamesamsung.org', port = 8080;
var Control = function(){

};
Control.save = function(bot, data){
	data = JSON.parse(data);
	if(data && data.action){
		switch(data.action){
			case 'stop':
				IRC.disconnect();
				console.log('Exiting bot');
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
		}
	}
}
Control.start = function(bot){
	var server = http.createServer(function(request, response) {
		var url = 'plugins/control/', plugins = [];
		request.url = request.url.replace('/', '');
		switch(request.url){
			case 'index.html':
			case '':
				var plugin_list = '', channel_list = '';
				url += 'interface.html';
				for(plugin in Plugins.plugins){
					plugin_list += '<li>'+plugin+'</li>\n';
				};
				for(channel in IRC.channels){
					channel_list += '<option value="'+IRC.channels[channel]+'">'+IRC.channels[channel]+'</option>\n';
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
			if (message.type === 'utf8') {
				Control.save(bot, message.utf8Data);
			}
    	});
    	connection.on('close', function(connection) {
		});
	});
};
exports.init = function(plugins, bot){
	console.log('Starting control plugin…');
	Control.start(bot);
};