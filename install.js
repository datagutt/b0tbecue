var config = require('./configs/config.local.js').config;
mongo = require('mongojs');
var url = config.db.username + ':' + config.db.password + '@' + config.db.server + '/' + config.db.name;
//console.log(url);
db = exports.db = mongo.connect(url, ['levels']);
if(process.argv.length <= 3){
	console.log('node install.js user host');
	process.exit(0);
}
var user = process.argv[2];
var host = process.argv[3];
parsed = JSON.parse('{"owners":{"'+user+'": "'+host+'"}}');
db.levels.save(parsed, function(err, data){
	if(err || !data){
		throw err;
	}else{
		console.log(data);
	}
});
db.close();