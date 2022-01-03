/* eslint-disable */

const { exec } = require('child_process');
const { api_key, api_secret, id } = require('./firefox_api_creds.json');

exec(
	`npx web-ext sign -s ./dist -a ./web-ext-artifacts --api-key ${api_key} --api-secret ${api_secret} --id "${id}"`,
	(error, stdout, stderr) => {
		if (error) return console.log(`error: ${error.message}`);
		if (stderr) return console.log(`stderr: ${stderr}`);

		console.log(`stdout: ${stdout}`);
	}
);
