var _ = require('underscore');
var request = require('request');
var async = require('async');
var config = require('../config');

var db = require('./db')(config);
var elastic = require('./elastic')(config);

var through = require('through');
var single = require('single-line-log');

require('colors');

function exportCollection(desc, callback) {
	var collection = db[desc.name];

	if (!collection) {
		return callback('collection ' + desc.name + ' does not exist.');
	}

	console.log(('====> exporting collection [' + desc.name + ']').bold.white);

	async.waterfall([
		function (next) {
			console.log('----> checking connection to elastic');
			elastic.ping({requestTimeout: 1000}, function (err) {
				next(err);
			});
		},
		function (next) {
			console.log('----> dropping existing index [' + desc.index + ']');
			elastic.indices.delete({index: desc.index}, function (err) {
				var indexMissing = err && err.message.indexOf('IndexMissingException') === 0;
				next(indexMissing ? null : err);
			});
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

			var takeFields = through(function (item) {
				if (desc.fields) {
					item = _.pick(item, desc.fields);
				}

				this.queue(item);
			});

			//var postToElastic = request.post(config.elastic + '/a');

			var progress = function () {
				var count = 0;
				return through(function () {
					single(('------> processed ' + (count++) + ' documents').magenta);
				});
			};

			var stream = collection
				.find({})
				.sort({_id: 1})
				.pipe(takeFields)
//				.pipe(postToElastic)
				.pipe(progress());

			stream.on('end', next);
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

	async.series(exports, function () {
		async.each([db, elastic], _close);

		function _close(conn, callback) {
			conn.close(callback);
		}
	});
}

module.exports = {
	run: exporter
};