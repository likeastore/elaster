var _ = require('underscore');
var moment = require('moment');
var async = require('async');
var config = require('../config');

var db = require('./db')(config);
var elastic = require('./elastic')(config);

var through = require('through');
var single = require('single-line-log');

require('colors');

function format(duration) {
	return duration.hours() + ':' + duration.minutes() + ':' + duration.seconds() + ':' + duration.milliseconds();
}

function exportCollection(desc, callback) {
	var collection = db[desc.name];

	if (!collection) {
		return callback('collection ' + desc.name + ' does not exist.');
	}

	console.log(('====> exporting collection [' + desc.name + ']').bold.white);

	var started = moment();

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
			console.log('----> creating new index [' + desc.index + ']');
			elastic.indices.create({index: desc.index}, function (err) {
				next(err);
			});
		},
		function (next) {
			console.log('----> initialize index mapping');

			if (!desc.mappings) {
				return next();
			}

			elastic.indices.putMapping({index: desc.index, type: desc.type, body: desc.mappings }, function (err) {
				next(err);
			});
		},
		function (next) {
			console.log('----> analizing collection [' + desc.name + ']');
			collection.count(function (err, total) {
				if (err) {
					return next(err);
				}

				console.log('----> find ' + total + ' documentents to export');
				next(null, total);
			});
		},
		function (total, next) {
			console.log('----> streaming collection to elastic');

			var takeFields = through(function (item) {
				if (desc.fields) {
					item = _.pick(item, desc.fields);
				}

				this.queue(item);
			});

			var postToElastic = through(function (item) {
				var me = this;

				me.pause();

				elastic.create({
					index: desc.index,
					type: desc.type,
					id: item._id.toString(),
					body: item
				}, function (err) {
					if (err) {
						console.error(('failed to create document in elastic.').bold.red);
						return next(err);
					}

					me.queue(item);
					me.resume();
				});
			});

			var progress = function () {
				var count = 0;
				return through(function () {
					var percentage = Math.floor(100 * ++count / total);
					single(('------> processed ' + count + ' documents [' + percentage + '%]').magenta);
				});
			};

			var stream = collection
				.find({})
				.sort({_id: 1})
				.pipe(takeFields)
				.pipe(postToElastic)
				.pipe(progress());

			stream.on('end', function (err) {
				next(err, total);
			});
		},
	], function (err) {
		if (err) {
			console.error(('====> collection [' + desc.name + '] - failed to export.\n').bold.red);
			console.error(err);
			return callback(err);
		}

		var duration = moment.duration(moment().diff(started));

		console.log(('====> collection [' + desc.name + '] - exported successfully.').green);
		console.log(('====> time elapsed ' + format(duration) + '\n').green);

		callback(null);
	});
}

function close() {
	async.each([db, elastic], _close);

	function _close(conn, callback) {
		conn.close(callback);
	}
}

function exporter(collections) {
	var exports = collections.map(function (c) {
		return function (callback) {
			exportCollection(c, callback);
		};
	});

	async.series(exports, close);
}

module.exports = {
	run: exporter
};