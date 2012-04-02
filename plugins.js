var Plugins = function(bot){
	this.bot = bot;
	this.hooks = {};
	this.plugins = {};
};
Plugins.prototype = {
	load: function(plugins){
		if(typeof plugins == 'array'){
			[].forEach(plugins, function(plugin){
				this.load(plugin);
			});
		}else{
			for(plugin in plugins){
				var file = plugins[plugin];
				var tempPlugin = require('./plugins/'+file);
				if(typeof tempPlugin == 'object'){
					tempPlugin.init(this, this.bot);
				}
				this.plugins[plugin]= tempPlugin;
			}
		}
	},
	isPluginFunction: function(plugin, func){
		return !!(plugin && this.plugins[plugin] && this.plugins[plugin][func] && typeof this.plugins[plugin][func] == 'function');
	},
	listen: function(plugin, event, func){
		if(typeof this.hooks[plugin] == 'undefined'){
			this.hooks[plugin] = [];
		}
		this.hooks[plugin][event] = func;
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