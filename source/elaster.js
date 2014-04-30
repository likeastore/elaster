var config = require('../config');
var exporter = require('./exporter');

exporter.run(config.collections);