var fs = require('fs');
var logged = [];
function log(content, channel){
	var now = new Date();
	var date = now.getDay() + '-' + now.getMonth() + '-' + now.getFullYear();
	var folder = 'plugins/logs/';
	var filename = folder + channel + '-' + date + '.txt';
	if(logged && !logged[date]){
		content = 'Started logging at: ' + date + '\n' + content;
		logged[date] = date;
	}
	content += '\n';
	fs.appendFile(filename, content, function(err) {
		if(err) {
			throw err;
		}else{
			console.log(content);
		}
	}); 
}
exports.init = function(plugins, bot){
	plugins.listen('Log', 'topic', function(args){
		log('[TOPIC] '+args.message, args.channel);
	});
	plugins.listen('Log', 'command', function(args){
		log('[COM] ['+args.channel+'] '+args.user+' ran command: '+args.command, args.channel);
	});
	plugins.listen('Log', 'message', function(args){
		log('[MSG] ['+args.channel+'] '+args.user+' said: '+args.message, args.channel);
	});
	plugins.listen('Log', 'join', function(args){
		log('[JOIN] ['+args.channel+'] '+args.user, args.channel);
	});
	plugins.listen('Log', 'part', function(args){
		log('[PART] ['+args.channel+'] '+args.user, args.channel);
	});
};