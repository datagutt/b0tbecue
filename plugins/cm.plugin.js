const DEFAULT_DOWNLOAD_LINK = 'http://get.cm';
var devices = {};
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
        bot.addCommand('download', 'Shows download link(s)', '[<device_name>]', USER_LEVEL_GLOBAL, true);
	bot.addCommand('downloads', 'Shows download link(s)', '[<device_name>]', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('changelog', 'Shows the cm changelog', '[<device_name>]', USER_LEVEL_GLOBAL, undefined, true);
	bot.addCommand('addDevice', '[<device>]', 'Adds device', USER_LEVEL_ADMIN, undefined);
	//bot.addCommand('changeDevice', '[<device>]', 'Changes device', USER_LEVEL_ADMIN);
	bot.addCommand('removeDevice', '[<device>]', 'Removes device', USER_LEVEL_ADMIN);
	// Devices
	addDevice('samsung', 'crespo', 'GT-I9020', 'http://get.cm/?device=crespo');
	addDevice('samsung', 'maguro', 'GT-I9250', 'http://get.cm/?device=maguro');
	addDevice('samsung', 'toro', 'SCH-I515', 'http://get.cm/?device=toro');
	addDevice('samsung', 'p1', 'SGH-I987', 'http://get.cm/?device=p1');
	addDevice('samsung', 'p1c', 'SCH-I800', 'http://get.cm/?device=p1c');
	addDevice('samsung', 'galaxys2', 'GT-I9100', 'http://get.cm/?device=galaxys2');
	addDevice('samsung', 'galaxysmtd', 'GT-I9000', 'http://get.cm/?device=galaxysmtd');
	addDevice('samsung', 'vibrantmtd', 'SGH-T959', 'http://get.cm/?device=vibrantmtd');
	addDevice('samsung', 'captivatemtd', 'SGH-I897', 'http://get.cm/?device=captivatemtd');
	addDevice('samsung', 'fascinatemtd', 'SCH-I500', 'http://get.cm/?device=fascinatemtd');
	addDevice('samsung', 'galaxysbmtd', 'GT-I9000B', 'http://get.cm/?device=galaxysbmtd');
	addDevice('samsung', 'mesmerizemtd', 'SCH-I500', 'http://get.cm/?device=mesmerizemtd');
	addDevice('samsung', 'showcasemtd', 'SCH-I500', 'http://get.cm/?device=showcasemtd');
	addDevice('samsung', 'i777', 'SGH-I777', 'http://get.cm/?device=i777');
	addDevice('samsung', 'i9300', 'GT-I9300', 'http://get.cm/?device=i9300');
	addDevice('asus', 'tf300t', 'TF300T', 'http://get.cm/?device=tf300t');

        var count = 0;
	plugins.listen(this, 'join', function(args){
                // Send a notice to users with webchat to change their nickname
		if (args.user.indexOf("qwebirc") == 0) {
			IRC.notice(args.user, 'Please choose a proper nickname with "/nick nickname"');
		}
	});
	plugins.listen(this, 'message', function(args){
		if(args.message.indexOf("?") != -1){
			count++;
		}
		if (count >= 7) {
			IRC.message(args.channel, "derp");
			count = 0;
		}
	});

	plugins.listen(this, 'command', function(args){
		var level = bot.getUserLevel(args.user, args.host);
		if(!bot.isCommand(args.command, level)){
			return;
		}
		switch(args.command){
                        case 'download':
			case 'downloads':
				if(args.arguments && args.arguments[0]){
					device = getDevice(args.arguments[0]);
					if(typeof device == 'object'){
						IRC.message(args.channel, 'Download at: ' + device['download_link']);
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
			case 'changelog':
				var url = '';
				if(args.arguments && args.arguments[0]){
					url = "#" + args.arguments[0] + "/cm9/next";
				}
				IRC.message(args.channel, 'http://changelog.bbqdroid.org/' + url);
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
		}
	});
}
