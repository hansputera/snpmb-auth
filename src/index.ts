import { SnpmbClient } from "./SnpmbClient.js";

const snpmb = new SnpmbClient({
    email: process.env.EMAIL ?? '',
    password: process.env.PASSWORD ?? '',
});

console.log(await snpmb.authManager.login());
console.log(await snpmb.authManager.getVervalApiUrl());
console.log(await snpmb.authManager.getVervalToken());
console.log(await snpmb.authManager.fetchInfo());
