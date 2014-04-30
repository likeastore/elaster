# Elaster

MongoDB collection to Elastic Search index exporter.

## Usage

Clone the repo,

```bash
$ git clone https://github.com/likeastore/elaster
$ cd elaster
```

Edit config file `/config/index.js`,

```js
module.exports = {
	mongo: {
		connection: 'mongodb://localhost:27017/exampledb'
	},

	elastic: {
		connection: 'http://localhost:9200'
	},

	export: {
		// export configuration
	}
};

```

In `export` configuration section you can setup which collections to export, which mappings to use, e.g.,

```js
	export: {
		collections: [{
				name: 'items',
				index: 'items',
				type: 'item'
				fields: ['_id', 'title', 'description', 'user', 'date'],
				mapping: {
					// Elastic Seach mapping
				}
			}, {
				name: 'users',
				index: 'users',
				type: 'user'
				fields: ['_id', 'email', 'created', 'bio', 'address']
			}
		]
	}
```

The `mapping` is optional field, if it's missing when Elastic Seach default mapping is used.

Once, config file is updated run exporter,

```bash
$ node source/elaster
```

## Licence (MIT)

Copyright (c) 2014, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
