import { SnpmbClient } from './SnpmbClient.js';

const snpmb = new SnpmbClient({
	email: process.env.EMAIL ?? '',
	password: process.env.PASSWORD ?? '',
});

console.log(await snpmb.authManager.login());

console.log(await snpmb.vervalManager.getVervalApiUrl());
console.log(await snpmb.vervalManager.getVervalToken());
console.log(await snpmb.vervalManager.fetchInfo());

console.log(await snpmb.snbpManager.getSnbpToken());
console.log(await snpmb.snbpManager.fetchFinalizeStatus());
console.log(await snpmb.snbpManager.fetchUserInfo());
console.log(await snpmb.snbpManager.fetchStudentProgram());
