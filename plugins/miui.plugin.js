const DEFAULT_DOWNLOAD_LINK = 'http://miuiandroid.com/community/link-forums/roms.73/';
var devices = {};
// save this in db
var version = '2.4.13';
function sortObject(o) {
	var sorted = {},
	key, a = [];

	for (key in o) {
		if (o.hasOwnProperty(key)) {
			a.push(key);
		}
	}

	a.sort();
	for (key = 0; key < a.length; key++) {
		sorted[a[key]] = o[a[key]];
	}
	return sorted;
}
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
	devices = sortObject(devices);
}
var removeDevice = function(manufacturer, name){
	if(devices[manufacturer] && devices[manufacturer][name]){
		delete devices[manufacturer][name];
	}
	devices = sortObject(devices);
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
	bot.addCommand('stats', 'Link to stats', '', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('forums', 'Link to forums', '', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('logcat', 'Link to logcat', '', USER_LEVEL_GLOBAL, undefined, true);
        bot.addCommand('bugs', 'Link to bugs', '', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('addDevice', '[<device>]', 'Adds device', USER_LEVEL_ADMIN, undefined);
	//bot.addCommand('changeDevice', '[<device>]', 'Changes device', USER_LEVEL_ADMIN);
	bot.addCommand('removeDevice', '[<device>]', 'Removes device', USER_LEVEL_ADMIN);
	bot.addCommand('updateVersion', '[<version>]', 'Updates version', USER_LEVEL_ADMIN);
	// Devices
		addDevice('google', 'Galaxy Nexus', 'GT-I9250', 'http://files.miuiandroid.com/VERSION/miuiandroid_GNEX-VERSION.zip');
		addDevice('google', 'NexusS', 'GT-I9020', 'http://files.miuiandroid.com/VERSION/miuiandroid_NS-VERSION.zip');
		addDevice('google', 'NexusOne', 'PB99100', 'http://files.miuiandroid.com/VERSION/miuiandroid_N1-VERSION.zip');
		addDevice('samsung', 'GalaxyS2', 'GT-I9100', 'http://files.miuiandroid.com/VERSION/miuiandroid_SGS2-VERSION.zip');
		addDevice('samsung', 'Captivate', 'SGH-I897', 'http://files.miuiandroid.com/VERSION/miuiandroid_Captivate-VERSION.zip');
		addDevice('samsung', 'GalaxyS', 'I9000', 'http://files.miuiandroid.com/VERSION/miuiandroid_i9100-VERSION.zip');
		addDevice('motorola', 'Defy', '?', 'http://files.miuiandroid.com/VERSION/miuiandroid_Defy-VERSION.zip');
		addDevice('motorola', 'Milestone', 'A853', 'http://files.miuiandroid.com/VERSION/miuiandroid_Milestone-VERSION.zip');
		addDevice('htc', 'Sensation', 'Z710e', 'http://files.miuiandroid.com/VERSION/miuiandroid_Sensation-VERSION.zip');
		addDevice('htc', 'Desire', 'A8181', 'http://files.miuiandroid.com/VERSION/miuiandroid_Desire-VERSION.zip');
		addDevice('htc', 'DesireZ', 'Saga', 'http://files.miuiandroid.com/VERSION/miuiandroid_DesireZ-VERSION.zip');
		addDevice('htc', 'DesireS', 'A7272', 'http://files.miuiandroid.com/VERSION/miuiandroid_DesireS-VERSION.zip');
		addDevice('htc', 'DesireHD', 'A9191', 'http://files.miuiandroid.com/VERSION/miuiandroid_DHD-VERSION.zip');
		addDevice('htc', 'HD2', 'T8585', 'http://files.miuiandroid.com/VERSION/miuiandroid_HD2-VERSION.zip');
		addDevice('htc', 'IncredibleS', 'S710e', 'http://files.miuiandroid.com/VERSION/miuiandroid_IncredibleS-VERSION.zip');
		addDevice('huawei', 'Honor', 'U8860', 'http://files.miuiandroid.com/VERSION/miuiandroid_Honor-VERSION.zip');
		addDevice('xiaomi', 'MI-ONE', 'MI-ONE+', 'http://files.miuiandroid.com/VERSION/update.zip');
		addDevice('lg', 'Optimus2x', 'P990', 'http://files.miuiandroid.com/VERSION/miuiandroid_Optimus2x-VERSION.zip');
	plugins.listen(this, 'command', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		if(!bot.isCommand(args.command, level)){
			return;
		}
		switch(args.command){
			case 'downloads':
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
				IRC.message(args.channel, 'Stats: http:/stats.miuiandroid.com/');
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
