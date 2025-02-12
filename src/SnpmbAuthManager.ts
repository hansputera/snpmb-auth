import axios, { type AxiosInstance } from 'axios';
import { FileCookieStore } from 'tough-cookie-file-store';
import { CookieJar } from 'tough-cookie';

import type { SnpmbClientParams } from "@/@types/index.js";
import type { SnpmbClient } from "@/SnpmbClient.js";
import { DEFAULT_SNPMB_COOKIE_FILE, SNPMB_DASHBOARD_URL, SNPMB_SIGN_URL, SNPMB_VERVAL_URL } from "@/const.js";
import { existsSync, writeFileSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { HttpsCookieAgent } from 'http-cookie-agent/http';

const WRONG_CREDENTIALS_REG = /email atau kata sandi anda salah\!/gi;
const LOGOUT_URL_REG = /window\.location\.href='(https?:\/\/[^']+\/signout\/global\?[^']+)'/;

const INDEX_CHUNK_REG = /<script[^>]*\s+src=["'](\/_next\/static\/chunks\/pages\/index[^"']+)["'][^>]*>/g;
const URL_REG = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

/**
 * @class SnpmbAuthManager
 */
export class SnpmbAuthManager
{
    protected $http!: AxiosInstance;

    /**
     * @constructor
     * @param $client SNPMB Client Instance
     * @param params SNPMB Client Params
     */
    constructor(protected $client: SnpmbClient, private readonly params: SnpmbClientParams) {
        this.initializeCookieFile();

        this.$http = axios.create({
            httpsAgent: new HttpsCookieAgent({
                cookies: {
                    jar: new CookieJar(new FileCookieStore(params.snpmb?.cookieFile ?? DEFAULT_SNPMB_COOKIE_FILE)),
                },
                rejectUnauthorized: false,
            }),
        });
    }

    /**
     * Logged in using your credentials
     * @return {Promise<boolean>}
     */
    public async login(): Promise<boolean> {
        const snpmbSignUrl = await this.getCurrentSsoUrl();
        const snpmbSignParsedUrl = new URL(snpmbSignUrl);

        const payload = snpmbSignParsedUrl.searchParams;
        payload.set('username', this.params.email);
        payload.set('password', this.params.password);

        const response = await this.$http.post(SNPMB_SIGN_URL, Object.fromEntries(payload), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).catch(err => err.response);

        if (WRONG_CREDENTIALS_REG.test(response.data)) {
            return false;
        }

        return true;
    }

    /**
     * Logout from logged account
     * @param soft Do you want safe logout or hard logout?
     * @return {Promise<boolean>}
     */
    public async logout(soft = true): Promise<boolean> {
        if (!soft) {
            return unlink(this.params.snpmb?.cookieFile ?? DEFAULT_SNPMB_COOKIE_FILE)
                .then(() => {
                    this.initializeCookieFile();
                    return true;
                }).catch(() => false);
        }

        // Safe logout = logout using real flow
        const dashboardParsedUrl = new URL(this.params.snpmb?.dashboardUrl ?? SNPMB_DASHBOARD_URL);
        const logoutAuthUrl = new URL('./auth/logout', dashboardParsedUrl.origin);

        const response = await this.$http.get(logoutAuthUrl.href).catch(e => e.response);
        const finalUrl = new URL(`./${response.request.path}`, `https://${response.request.host}`).href;

        // You arent logged in
        if (/signin/gi.test(finalUrl)) {
            return false;
        }

        // It's expected response
        if (/signout/gi.test(finalUrl)) {
            const logoutUrl = LOGOUT_URL_REG.exec(response.data)?.at(-1);

            if (!logoutUrl) {
                return false;
            }

            await this.$http.get(logoutUrl).catch(e => e.response);
            return true;
        }

        return false;
    }

    public async getVervalToken(): Promise<string | undefined> {
        // Extract index chunk page
        const vervalFirstResponse = await this.$http.get(this.params.snpmb?.vervalUrl ?? SNPMB_VERVAL_URL);
        const scriptChunks = INDEX_CHUNK_REG.exec(vervalFirstResponse.data);
        
        const chunkIndexUrl = scriptChunks?.at(1);

        if (!chunkIndexUrl) {
            return undefined;
        }

        // Extracting verval snpmb API
        const chunkResponse = await this.$http.get(new URL(`./${chunkIndexUrl}`, this.params.snpmb?.vervalUrl ?? SNPMB_VERVAL_URL).href);
        const vervalApiUrl = URL_REG.exec(chunkResponse.data)?.at(0);

        if (!vervalApiUrl) {
            return undefined;
        }

        return vervalApiUrl;
    }

    /**
     * Get current sign SSO url
     * @param dashboardUrl Portal SNPMB URL
     * @return {Promise<string>}
     */
    protected async getCurrentSsoUrl(dashboardUrl = this.params.snpmb?.dashboardUrl ?? SNPMB_DASHBOARD_URL): Promise<string> {
        const response = await this.$http.get(dashboardUrl);

        return new URL(`./${response.request.path}`, `https://${response.request.host}`).href;
    }

    protected initializeCookieFile(): void
    {
        const cookiePath = this.params.snpmb?.cookieFile ?? DEFAULT_SNPMB_COOKIE_FILE;
        if (!existsSync(cookiePath)) {
            writeFileSync(cookiePath, '', { encoding: 'utf8' });
        }
    }
}