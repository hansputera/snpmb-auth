import { SnpmbClient } from "./SnpmbClient.js";

const snpmb = new SnpmbClient({
    email: process.env.EMAIL ?? '',
    password: process.env.PASSWORD ?? '',
});

console.log(await snpmb.authManager.login());
console.log(await snpmb.authManager.$verval.getVervalApiUrl());
console.log(await snpmb.authManager.$verval.getVervalToken());
console.log(await snpmb.authManager.$verval.fetchInfo());