var config = require('./configs/config.local.js').config;
mongo = require('mongojs');
var url = config.db.username + ':' + config.db.password + '@' + config.db.server + '/' + config.db.name;
db = exports.db = mongo.connect(url, ['levels', 'devices']);
devices = {};
devices.samsung = { crespo: 
      { name: 'crespo',
        model: 'GT-I9020',
        download_link: 'http://get.cm/?device=crespo' },
     maguro: 
      { name: 'maguro',
        model: 'GT-I9250',
        download_link: 'http://get.cm/?device=maguro' },
     toro: 
      { name: 'toro',
        model: 'SCH-I515',
        download_link: 'http://get.cm/?device=toro' },
     galaxys2: 
      { name: 'galaxys2',
        model: 'GT-I9100',
        download_link: 'http://get.cm/?device=galaxys2' },
     galaxysmtd: 
      { name: 'galaxysmtd',
        model: 'GT-I9000',
        download_link: 'http://get.cm/?device=galaxysmtd' },
     vibrantmtd: 
      { name: 'vibrantmtd',
        model: 'SGH-T959',
        download_link: 'http://get.cm/?device=vibrantmtd' },
     captivatemtd: 
      { name: 'captivatemtd',
        model: 'SGH-I897',
        download_link: 'http://get.cm/?device=captivatemtd' },
     fascinatemtd: 
      { name: 'fascinatemtd',
        model: 'SCH-I500',
        download_link: 'http://get.cm/?device=fascinatemtd' },
     galaxysbmtd: 
      { name: 'galaxysbmtd',
        model: 'GT-I9000B',
        download_link: 'http://get.cm/?device=galaxysbmtd' },
     mesmerizemtd: 
      { name: 'mesmerizemtd',
        model: 'SCH-I500',
        download_link: 'http://get.cm/?device=mesmerizemtd' },
     showcasemtd: 
      { name: 'showcasemtd',
        model: 'SCH-I500',
        download_link: 'http://get.cm/?device=showcasemtd' },
     i777: 
      { name: 'i777',
        model: 'SGH-I777',
        download_link: 'http://get.cm/?device=i777' }
};
db.devices.save(devices);
db.close();