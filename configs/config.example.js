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
	/* For control plugin */
	controlpw: 'password',
	skynetpw: 'skynet'
};
config.db = {
	server: '127.0.0.1',
	username: 'example',
	password: 'password',
	name: 'b0tbecue'
};
exports.config = config;