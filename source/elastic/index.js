var elasticsearch = require('elasticsearch');

module.exports = function (config) {
	var client = elasticsearch.Client({
		host: config.elastic.connection,
		requestTimeout: 5000
	});

	return client;
};