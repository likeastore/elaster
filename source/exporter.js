var async = require('async');
var stream = require('stream-wrapper');
var config = require('../config');
var db = require('./db')(config);
var elastic = require('./elastic')(config);

require('colors');

function exportCollection(desc, callback) {
	var collection = db[desc.name];

	if (!collection) {
		return callback('collection ' + desc.name + ' does not exist.');
	}

	console.log('exporting collection [' + desc.name + ']'.white);

	async.waterfall([
		function (next) {
			console.log('----> dropping existing index [' + collection.index + ']');
			elastic.dropIndex(collection.index, next);
		},
		function (next) {
			console.log('----> analizing collection [' + collection.index + ']');
			collection.count(function (err, count) {
				if (err) {
					return next(err);
				}

				console.log('----> detected ' + count + ' documentents to export');
				next(null, count);
			});
		},
		function (count, next) {
			console.log('----> streaming collection to elastic');

			var putToElastic = function () {

			};

			collection
				.find({})
				.sort({_id: 1})
				.pipe(putToElastic);
		}
	], function (err) {
		if (err) {
			return callback(err);
		}

		console.log('====> collection [' + collection.name + '] - exported succesfully.\n'.white);
		callback(null);
	});
}

function exporter(collections, callback) {
	var exports = collections.map(function (c) {
		return function (callback) {
			exportCollection(c, callback);
		};
	});

	async.series(exports, callback);
}

module.exports = {
	run: exporter
};