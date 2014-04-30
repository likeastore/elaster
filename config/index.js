module.exports = {
	mongo: {
		connection: 'mongodb://localhost:27017/likeastoredb'
	},

	elastic: {
		connection: 'http://localhost:9200'
	},

	collections: [ {
		name: 'items',
		index: 'items',
		type: 'item',
		fields: ['_id', 'authorName', 'created', 'date', 'description', 'source', 'type', 'user']
	}]
};