var config = require('../config');
var exporter = require('./exporter');

var collections = config.collections;

if (!collections || collections.length === 0) {
	throw 'config.collections section is empty';
}

exporter.run(collections, function (err) {
	if (err) {
		throw err;
	}

	console.log('elaster finished sucessfully...');
});