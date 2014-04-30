module.exports = {
	mongo: 'mongodb://localhost:27017/likeastoredb',

	collections: [ {
		name: 'items',
		fields: ['_id', 'authorName', 'created', 'date', 'description', 'source', 'type', 'user']
	}]
};