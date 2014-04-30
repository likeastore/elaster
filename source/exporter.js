var _ = require('underscore');
var request = require('request');
var async = require('async');
var config = require('../config');
var db = require('./db')(config);
var through = require('through');

//var elastic = require('./elastic')(config);

require('colors');

function exportCollection(desc, callback) {
	var collection = db[desc.name];

	if (!collection) {
		return callback('collection ' + desc.name + ' does not exist.');
	}

	console.log(('====> exporting collection [' + desc.name + ']').bold.white);

	async.waterfall([
		function (next) {
			console.log('----> dropping existing index [' + desc.index + ']');
			//elastic.dropIndex(collection.index, next);
			next();
		},
		function (next) {
			console.log('----> analizing collection [' + desc.name + ']');
			collection.count(function (err, count) {
				if (err) {
					return next(err);
				}

				console.log('----> find ' + count + ' documentents to export');
				next(null, count);
			});
		},
		function (count, next) {
			console.log('----> streaming collection to elastic');

			var takeFields = function (item) {
				if (desc.fields) {
					item = _.pick(item, desc.fields);
				}

				this.queue(item);
			};

			var postToElastic = request.post(config.elastic + '/a');

			var stream = collection
				.find({})
				.sort({_id: 1})
				.pipe(through(takeFields));
				.pipe(postToElastic);

			stream.on('end', next);
		},
		function (next) {
			console.log('----> closing down connections');
			db.close(next);
		}
	], function (err) {
		if (err) {
			console.error(('====> collection [' + desc.name + '] - failed to export.\n').bold.red);
			console.error(err);

			return callback(err);
		}

		console.log(('====> collection [' + desc.name + '] - exported successfully.\n').bold.green);

		callback(null);
	});
}

function exporter(collections) {
	var exports = collections.map(function (c) {
		return function (callback) {
			exportCollection(c, callback);
		};
	});

	async.series(exports);
}

module.exports = {
	run: exporter
};