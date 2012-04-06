var Plugins = function(bot){
	this.bot = bot;
	this.hooks = {};
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
		if(typeof this.hooks[plugin.name] == 'undefined'){
			this.hooks[plugin.name] = [];
		}
		this.hooks[plugin.name][event] = func;
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
