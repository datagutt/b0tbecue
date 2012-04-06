var Plugins = function(bot){
	this.bot = bot;
	this.hooks = {};
	this.sets = {};
	this.plugins = {};
};
Plugins.prototype = {
	load: function(plugins){
		for(plugin in plugins){
			var tempPlugin = require('./plugins/'+plugin);
			if(typeof tempPlugin == 'object'){
				if(plugins[plugin]){
					tempPlugin.name = plugin;
					tempPlugin.config = plugins[plugin];
				}
				tempPlugin.init(this, this.bot);
			}
			this.plugins[plugin] = tempPlugin;
		}
	},
	isPluginFunction: function(plugin, func){
		return !!(plugin && this.plugins[plugin] && this.plugins[plugin][func] && typeof this.plugins[plugin][func] == 'function');
	},
	listen: function(plugin, event, func){
		if(this.hooks[plugin.name] == undefined){
			this.hooks[plugin.name] = [];
		}
		this.hooks[plugin.name][event] = func;
	},
	registerSet: function(plugin, name){
		if(this.sets[name] == undefined){
			this.sets[name] = [];
		}
		this.sets[name][plugin.name] = plugin;
	},
	handleSet: function(){
		for(set in sets){
			if(sets[set]){
			}
		}
	},
	fire: function(event, passedVars){
		var hooks = this.hooks;
		var self = this;
		for (plugin in hooks){
			if(hooks[plugin]){
				if(typeof hooks[plugin][event] == 'function'){
					hooks[plugin][event].apply(self, [passedVars]);
				}	
			}
		}
	}
};
exports.Plugins = Plugins;
