try{
	var io = require('socket.io').listen(1337);
}catch(e){
	throw new Error('socket.io is required for the control plugin!');
}
var http = require('http'), fs = require('fs');
var Control = function(){

};
Control.start = function(){
	io.sockets.on('connection', function (socket) {
		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});
};
exports.init = function(){
	console.log('Starting control plugin…');
	Control.start();
};