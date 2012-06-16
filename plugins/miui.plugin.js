const DEFAULT_DOWNLOAD_LINK = 'http://miuiandroid.com/community/link-forums/roms.73/';
var devices = {};
// save this in db
var version = '2.6.1';
var addDevice = function(manufacturer, name, model, download_link){
	if(!download_link){
		download_link = DEFAULT_DOWNLOAD_LINK;
	}
	if(!devices[manufacturer]){
		devices[manufacturer] = {};
	}
	devices[manufacturer][name] = {};
	devices[manufacturer][name]['name'] = name;
	devices[manufacturer][name]['model'] = model;
	devices[manufacturer][name]['download_link'] = download_link;
}
var removeDevice = function(manufacturer, name){
	if(devices[manufacturer] && devices[manufacturer][name]){
		devices[manufacturer][name] = undefined;
	}
}
var getDevice = function(name){
	for(manufacturer in devices){
		if(devices[manufacturer] && devices[manufacturer][name] && devices[manufacturer][name]['name'] == name){
			return devices[manufacturer][name];
		}
	};
}
var getDevices = function(manufacturer){
	var result = {}, device;
	if(manufacturer){
		return devices[manufacturer];
	}else{
		for(manufacturer in devices){
			for(device in devices[manufacturer]){
				device = devices[manufacturer][device];
				result[device.name] = device; 
			}
		}
	}
	return result;
}
exports.init = function(plugins, bot){
	bot.addCommand('supported', 'Shows supported devices', '[<manufacturer>]', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('downloads', 'Shows download link(s)', '[<device_name>]', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('download', 'Shows download link(s)', '[<device_name>]', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('stats', 'Link to stats', '', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('forums', 'Link to forums', '', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('logcat', 'Link to logcat', '', USER_LEVEL_GLOBAL, undefined, true);
    bot.addCommand('bugs', 'Link to bugs', '', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('addDevice', '[<device>]', 'Adds device', USER_LEVEL_ADMIN, undefined);
	//bot.addCommand('changeDevice', '[<device>]', 'Changes device', USER_LEVEL_ADMIN);
	bot.addCommand('removeDevice', '[<device>]', 'Removes device', USER_LEVEL_ADMIN);
	bot.addCommand('updateVersion', '[<version>]', 'Updates version', USER_LEVEL_ADMIN);
	// Devices (ICS)
	addDevice('google', 'GalaxyNexus(GSM)', 'GT-I9250', 'http://files.miuiandroid.com/VERSION/miuiandroid_maguro-VERSION.zip');
	addDevice('google', 'GalaxyNexus(LTE)', 'toro', 'http://files.miuiandroid.com/VERSION/miuiandroid_toro-VERSION.zip');
	addDevice('google', 'NexusS', 'GT-I9020', 'http://files.miuiandroid.com/VERSION/miuiandroid_crespo-VERSION.zip');
	addDevice('htc', 'OneX', 'endeavoru', 'http://files.miuiandroid.com/VERSION/miuiandroid_endeavoru-VERSION.zip');
	addDevice('htc', 'Sensation', 'Z710e', 'http://files.miuiandroid.com/VERSION/miuiandroid_pyramid-VERSION.zip');
	addDevice('samsung', 'GalaxyS2', 'GT-I9100', 'http://files.miuiandroid.com/VERSION/miuiandroid_SGS2-VERSION.zip');
	addDevice('huawei', 'Honor', 'U8860', 'http://files.miuiandroid.com/VERSION/miuiandroid_hwu8860-VERSION.zip');
	addDevice('huawei', 'AscendP1', 'U9200', 'http://files.miuiandroid.com/VERSION/miuiandroid_hwu9200-VERSION.zip');
	addDevice('sony', 'ArcS', 'LT18i', 'http://files.miuiandroid.com/VERSION/miuiandroid_LT18i-VERSION.zip');
	addDevice('xiaomi', 'MI-ONE', 'MI-ONE+', 'http://files.miuiandroid.com/VERSION/update.zip');
	
	plugins.listen(this, 'command', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		if(!bot.isCommand(args.command, level)){
			return;
		}
		switch(args.command){
			case 'downloads':
			case 'download':
				if(args.arguments && args.arguments[0]){
					device = getDevice(args.arguments[0]);
					if(typeof device == 'object'){
						IRC.message(args.channel, 'Download at: ' + device['download_link'].replace(/VERSION/ig, version));
					}else{
						IRC.message(args.channel, 'Device is not supported!');
					}
				}else{
					IRC.message(args.channel, 'Downloads: ' + DEFAULT_DOWNLOAD_LINK);
				}
			break;
			case 'supported':
				var supported, msg = '';
				if(args.arguments && args.arguments[0]){
					supported = getDevices(args.arguments[0]);
				}else{
					supported = getDevices();
				}
				for(device in supported){
					msg += supported[device]['name'] + ' ';
				};
				if(msg){
					IRC.message(args.channel, 'Supported devices: ' + msg);
				}else{
					IRC.message(args.channel, 'That manufacturer is not supported!');
				}
			break;
			case 'addDevice':
				if(args.arguments && args.arguments[0] && args.arguments[1] && args.arguments[2]){
					var manufacturer = args.arguments[0];
					var name = args.arguments[1];
					var model = args.arguments[2];
					var download_link = args.arguments[3] ? args.arguments[3] : DEFAULT_DOWNLOAD_LINK;
					addDevice(manufacturer, name, model, download_link);
				}else{
					IRC.message(args.channel, 'Not enough arguments!');
				}
			break;
			case 'removeDevice':
				if(args.arguments && args.arguments[0] && args.arguments[1]){
					var manufacturer = args.arguments[0];
					var name = args.arguments[1];
					if(removeDevice(manufacturer, device)){
						IRC.message(args.channel, 'Device removed!');
					}else{
						IRC.message(args.channel, 'Not a valid device or manufacturer!');
					}
				}else{
					IRC.message(args.channel, 'Not enough arguments!');
				}
			break;
			case 'updateVersion':
				if(args.arguments && args.arguments[0]) {
					var new_version = args.arguments[0];
					if(version = new_version){
						IRC.message(args.channel, 'Version changed!');
					}
				}else{
					IRC.message(args.channel, 'Not enough arguments!');
				}
			break;
			case 'forums':
				IRC.message(args.channel, 'Forum: http://miuiandroid.com/community/forum/');
			break;
			case 'stats':
				IRC.message(args.channel, 'Stats: http://stats.miuiandroid.com/');
			break;
			case 'logcat':
				IRC.message(args.channel, 'Logcat: http://logcat.miuiandroid.com/');
			break;
			case 'bugs':
				IRC.message(args.channel, 'Bugs: http://miuiandroid.com/community/forums/bugs.20/');
			break;
		}
	});
}
