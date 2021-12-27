/* eslint-disable */

const { exec } = require('child_process');
const { api_key, api_secret } = require('./firefox_api_creds.json');

exec(
	`npx web-ext sign -s ./dist -a ./web-ext-artifacts --api-key ${api_key} --api-secret ${api_secret} --id {8213fe4e-f8a6-4415-9e0a-0426ad36dfcd}`,
	(error, stdout, stderr) => {
		if (error) return console.log(`error: ${error.message}`);
		if (stderr) return console.log(`stderr: ${stderr}`);

		console.log(`stdout: ${stdout}`);
	}
);
