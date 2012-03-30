var Common = require('./bot.js');
var Bot = Common.Bot;
var config = require('./configs/config.local.js');
Bot = new Bot(config);
Bot.run();