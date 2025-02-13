import { SnpmbClient } from './SnpmbClient.js';

const snpmb = new SnpmbClient({
	email: process.env.EMAIL ?? '',
	password: process.env.PASSWORD ?? '',
	snpmb: {
		cookieFile: 'test.cookie.json',
	},
});

console.log(await snpmb.authManager.login());

console.log(await snpmb.vervalManager.getVervalApiUrl());
console.log(await snpmb.vervalManager.getVervalToken());
console.log(await snpmb.vervalManager.fetchInfo());

// School
console.log(await snpmb.vervalManager.fetchSchoolInfo());

// PDSS
console.log(await snpmb.pdssManager.getPdssToken());
console.log(await snpmb.pdssManager.getSchoolProfile());
