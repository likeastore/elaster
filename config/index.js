module.exports = {
	mongo: {
		connection: 'mongodb://likeastore:2758d3726ddab88b951b77b17343c9fe6672bbfe@christian.mongohq.com:10093/likeastoreproddb'
	},

	elastic: {
		host: {
			protocol: 'https',
			host: 'search.likeastore.com',
			port: 443,
			query: {
				access_token: '63882eb552185b755a954c9c3c9deba282b20588'
			}
		},

		requestTimeout: 5000,

		rejectUnauthorized: false
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