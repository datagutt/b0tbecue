IRC = require('./irc.js').IRC;
Plugins = require('./plugins.js').Plugins;
// Database
mongo = require('mongojs');
const VERSION = '0.1';
// Various user levels
// Should be constants, but then i cant make them global
exports.USER_LEVEL_GLOBAL = USER_LEVEL_GLOBAL = 1;
exports.USER_LEVEL_VOICE = USER_LEVEL_VOICE = 2;
exports.USER_LEVEL_MOD = USER_LEVEL_MOD = 3;
exports.USER_LEVEL_ADMIN = USER_LEVEL_ADMIN = 4;
exports.USER_LEVEL_OWNER = USER_LEVEL_OWNER = 5;
var Bot = function(config){
	// Init IRC and Plugins, set config variables
	Plugins = exports.Plugins = new Plugins(this);
	IRC = exports.IRC = new IRC(this, Plugins);
	db = exports.db = mongo.connect(config.db.username + ':' + config.db.password + '@' + config.db.server + '/' + config.db.name, ['levels', 'devices']);
	this.VERSION = VERSION;
	// Owners, mods, admins
	config.bot.owners = {};
	config.bot.admins = {};
	config.bot.mods = {};
	db.levels.find({}, function(err, levels){
		if(err){
			throw err;
		}else if(!levels){
			console.log('No levels found, run "install.js user host"');
			process.exit(0);
		}else{
			levels.forEach(function(level){
				for(type in level){
					if(type !== '_id'){
						config.bot[type] = level[type];
					}
				}
			});
		}
	});
	this.config = config.bot;
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
	getCommandMinimumLevel: function(name){
		if(this.commands[name]){
			return this.commands[name]['level'];
		}
		return false;
	},
	isCommand: function(name, level){
		if(this.commands[name]){
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
	isMod: function(user, host){
		var config = this.config;
		for(mod in config.mods){
			if(user == mod && config.mods[mod] == host){
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
		}else if(user && host && this.isMod(user, host)){
			return USER_LEVEL_MOD;
		}else{
			return USER_LEVEL_GLOBAL;
		}
	},
	run: function(){
		IRC.connect(IRC.config.server, IRC.config.port);
	}
};
exports.Bot = Bot;
