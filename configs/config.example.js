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
	owners: {
		'example': '~example@127.0.0.1'
	}
};
exports.config = config;