IRC = require('./irc.js').IRC;
Plugins = require('./plugins.js').Plugins;
const VERSION = "0.0.1";
var Bot = function(config){
	// Init IRC and Plugins, set config variables
	Plugins = exports.Plugins = new Plugins(this);
	IRC = exports.IRC = new IRC(this, Plugins);
	this.VERSION = VERSION;
	this.config = config.bot;
	IRC.config = config.irc;
	Plugins.load(config.plugins || {
		'Base': 'base.plugin.js'
	});
};
Bot.prototype = {
	run: function(){
		console.log('Connecting to '+IRC.config.server+':'+IRC.config.port);
		IRC.connect(IRC.config.server, IRC.config.port);
	}
};
exports.Bot = Bot;