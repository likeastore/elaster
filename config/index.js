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
		fields: ['_id', 'authorName', 'created', 'date', 'description', 'source', 'type', 'user'],
		mappings: {
			'item': {
				'properties': {
					'authorName': {
						'type': 'string'
					},
					'created': {
						'type': 'date',
						'format': 'dateOptionalTime'
					},
					'date': {
						'type': 'date',
						'format': 'dateOptionalTime'
					},
					'description': {
						'type': 'string'
					},
					'source': {
						'type': 'string',
						'index': 'not_analyzed'
					},
					'type': {
						'type': 'string'
					},
					'user': {
						'type': 'string'
					}
				}
			}
		}
	}]
};