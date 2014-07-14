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