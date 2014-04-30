var mongo = require('mongojs');

module.exports = function (config) {
	var collections = config.collections.map(function (c) {
		return c.name;
	});

	var db = mongo.connect(config.mongo, collections);
	if (!db) {
		throw new Error('could not connect to ' + config.mongo);
	}

	return db;
};
