require('dotenv').config(); // enables loading .env vars
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');

// Allow requests from client-side
app.use(cors({ origin: 'http://localhost:8080' }));

app.post('/api/token', async (req, res) => {
	try {
		var privateKey = fs.readFileSync('privateKey.pem');
		var token = jwt.sign(
			{
				sub: 'faj2720i2fdG7NsqznOKrthDvq58',
				name: 'Dumbledore',
				email: 'dumbledore@web3auth.io',
				aud: 'time_limit_exceeded', // -> to be used in Custom Authentication as JWT Field
				iss: 'https://my-authz-server', // -> to be used in Custom Authentication as JWT Field
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 60 * 60,
			},
			privateKey,
			{ algorithm: 'RS256', keyid: '676da9d312c39a429932f543e6c1b6512e4983' },
		);
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const listener = app.listen(process.env.PORT || 8081, () =>
	console.log('Listening on port ' + listener.address().port),
);