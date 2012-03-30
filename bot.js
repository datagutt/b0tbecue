IRC = require('./irc.js').IRC;
const VERSION = "0.0.1";
module.exports = {
	Bot: {}
}
var Bot = function(config){
	// wut?
	this.VERSION = VERSION;
	this.config = config.config.bot;
	IRC = module.exports.IRC = new IRC(this);
	IRC.config = config.config.irc;
};
Bot.prototype = {
	run: function(){
		console.log('Connecting to '+IRC.config.server+':'+IRC.config.port);
		IRC.connect(IRC.config.server, IRC.config.port);
	}
};
module.exports.Bot = Bot;