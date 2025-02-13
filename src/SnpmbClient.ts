import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { existsSync, writeFileSync } from 'node:fs';
import { HttpsCookieAgent } from 'http-cookie-agent/http';
import { CookieJar } from 'tough-cookie';
import { FileCookieStore } from 'tough-cookie-file-store';
import type { SnpmbClientParams } from './@types/index.js';
import { SnpmbAuthManager } from '@/SnpmbAuthManager.js';
import { DEFAULT_SNPMB_COOKIE_FILE, SNPMB_SNBP_URL } from './const.js';
import { SnpmbSnbpManager } from './snbp/SnpmbSnbpManager.js';
import { SnpmbVervalManager } from './verval/SnpmbVervalManager.js';

/**
 * @class SnpmbClient
 */
export class SnpmbClient {
	public authManager!: SnpmbAuthManager;

	public snbpManager!: SnpmbSnbpManager;
	public vervalManager!: SnpmbVervalManager;

	protected $http!: AxiosInstance;

	/**
	 * @constructor
	 * @param params SNPMB Client Auth Params
	 */
	constructor(private readonly params: SnpmbClientParams) {
		this.initializeCookieFile();

		this.$http = axios.create({
			httpsAgent: new HttpsCookieAgent({
				cookies: {
					jar: new CookieJar(
						new FileCookieStore(params.snpmb?.cookieFile ?? DEFAULT_SNPMB_COOKIE_FILE),
					),
				},
				rejectUnauthorized: false,
			}),
		});

		this.$http.interceptors.response.use(
			async (response) => response,
			async (error: AxiosError) => {
				const response = error.response;

				// If SNBP Fails
				if (response && error.config) {
					const snbpHost = new URL(this.params.snpmb?.snpbUrl ?? SNPMB_SNBP_URL).host;

					if (response.request.host === snbpHost && response.status === 401) {
						const newToken = await this.snbpManager.getSnbpToken();
						if (newToken) {
							return this.$http.request(error.config);
						}
					}
				}

				return Promise.reject(error);
			},
		);

		this.authManager = new SnpmbAuthManager(this.$http, params);
		this.snbpManager = new SnpmbSnbpManager(this.$http, params);
		this.vervalManager = new SnpmbVervalManager(this.$http, params);
	}

	protected initializeCookieFile(): void {
		const cookiePath = this.params.snpmb?.cookieFile ?? DEFAULT_SNPMB_COOKIE_FILE;
		if (!existsSync(cookiePath)) {
			writeFileSync(cookiePath, '', { encoding: 'utf8' });
		}
	}
}
