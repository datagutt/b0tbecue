IRC = require('./irc.js').IRC;
Plugins = require('./plugins.js').Plugins;
const VERSION = "0.0.1";
// Various user levels
// Should be constants, but then i cant make them global
exports.USER_LEVEL_GLOBAL = USER_LEVEL_GLOBAL = 1;
exports.USER_LEVEL_MODERATOR = USER_LEVEL_MODERATOR = 2;
exports.USER_LEVEL_ADMIN = USER_LEVEL_ADMIN = 3;
exports.USER_LEVEL_OWNER = USER_LEVEL_OWNER = 4;
var Bot = function(config){
	// Init IRC and Plugins, set config variables
	Plugins = exports.Plugins = new Plugins(this);
	IRC = exports.IRC = new IRC(this, Plugins);
	this.VERSION = VERSION;
	this.config = config.bot;
	// Owners, moderators, admins
	if(!this.config.owners){
		this.config.owners = {};
	}
	if(!this.config.admins){
		this.config.admins = {};
	}
	if(!this.config.moderators){
		this.config.moderators = {};
	}
	this.commands = {};
	IRC.config = config.irc;
	Plugins.load(config.bot.plugins || {
		'Base': 'base.plugin.js'
	});
};
Bot.prototype = {
	addCommand: function(name, usage, description, level, hidden){
		if(this.commands){
			if(!this.commands[name]){
				this.commands[name] = {};
				this.commands[name]['name'] = name;
				this.commands[name]['usage'] = usage;
				this.commands[name]['description'] = description;
				this.commands[name]['level'] = level;
				this.commands[name]['hidden'] = !!hidden;
			}
		}
	},
	isCommand: function(name){
		return !!this.commands[name];
	},
	canUseCommand: function(name, level){
		if(this.commands && this.commands[name]){
			return this.commands[name]['level'] <= level;
		}
		return false;
	},
	isOwner: function(user, host){
		var config = this.config;
		for(owner in config.owners){
			if(user == owner && config.owners[owner] == host){
				return true;
			}
		}
		return false;
	},
	isAdmin: function(user, host){
		var config = this.config;
		for(admin in config.admins){
			if(user == admin && config.admins[admin] == host){
				return true;
			}
		}
		return false;
	},
	isModerator: function(user, host){
		var config = this.config;
		for(moderator in config.moderators){
			if(user == moderators && config.moderators[moderator] == host){
				return true;
			}
		}
		return false;
	},
	getUserLevel: function(user, host){
		if(user && host && this.isOwner(user, host)){
			return USER_LEVEL_OWNER;
		}else if(user && host && this.isAdmin(user, host)){
			return USER_LEVEL_ADMIN;
		}else if(user && host && this.isModerator(user, host)){
			return USER_LEVEL_MODERATOR;
		}else{
			return USER_LEVEL_GLOBAL;
		}
	},
	run: function(){
		console.log('Connecting to '+IRC.config.server+':'+IRC.config.port);
		IRC.connect(IRC.config.server, IRC.config.port);
	}
};
exports.Bot = Bot;