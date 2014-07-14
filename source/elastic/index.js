var elasticsearch = require('elasticsearch');

module.exports = function (config) {
	var client = elasticsearch.Client(config.elastic);

	return client;
};