module.exports = {
	mongo: {
		connection: 'http://localhost:27017'
	},

	elastic: {
		host: {
		},

		requestTimeout: 5000
	},

	collections: [ {
		name: 'collections',
		index: 'collections',
		type: 'collection',
		fields: ['_id', 'public', 'title', 'description', 'user', 'userData'],
		mappings: {
			'collection': {
				'properties': {
					'public': {
						'type': 'boolean',
						'index': 'not_analyzed'
					},
					'title': {
						'type': 'string'
					},
					'description': {
						'type': 'string'
					},
					'user': {
						'type': 'string',
						'index': 'not_analyzed'
					},
					'userData': {
						'type': 'object',
						'index': 'not_analyzed'
					}
				}
			}
		}
	},
	{
		name: 'items',
		index: 'items',
		type: 'item',
		mappings: {
			'item': {
				'properties': {
					'authorName': {
						'type': 'string'
					},
					'itemId': {
						'type': 'string',
						'index': 'not_analyzed'
					},
					'idInt': {
						'type': 'string',
						'store': 'false',
						'index': 'not_analyzed'
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
					},
					'type': {
						'type': 'string',
						'index': 'not_analyzed'
					},
					'user': {
						'type': 'string',
						'index': 'not_analyzed'
					},
					'userData': {
						'type': 'object',
						'index': 'not_analyzed'
					}
				}
			}
		}
	}]
};
};