var config = {};
config.irc = {
	server: 'irc.freenode.net',
	port: 6667,
	channels: ['#b0tbecue']
};
config.bot = {
	nick: 'exampleb0t',
	name: 'b0tbecue-dev',
	prefix: '@',
	password: '',
	plugins: {
		'base.plugin.js': {},
		'control.plugin.js': {host: '127.0.0.1', port: '8080', password: '', skynet_password: ''}
	}
};
config.db = {
	server: '127.0.0.1',
	username: 'example',
	password: 'password',
	name: 'b0tbecue'
};
exports.config = config;
