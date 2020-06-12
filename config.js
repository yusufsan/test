var config = {
	database: {
		url: 'mongodb://127.0.0.1:27017/test1'

	},
	server: {
		host: '127.0.0.1',
		port: '3000'
	},
	jwtKey: 'my_secret_key',
	jwtExpirySeconds: 120,
	saltingRounds: 10
}

module.exports = config