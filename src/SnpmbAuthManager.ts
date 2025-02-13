import axios, { type AxiosInstance } from 'axios';

import type { SnpmbClientParams } from '@/@types/index.js';
import { DEFAULT_SNPMB_COOKIE_FILE, SNPMB_DASHBOARD_URL, SNPMB_SIGN_URL } from '@/const.js';
import { unlink } from 'node:fs/promises';

const WRONG_CREDENTIALS_REG = /email atau kata sandi anda salah\!/gi;
const LOGOUT_URL_REG = /window\.location\.href='(https?:\/\/[^']+\/signout\/global\?[^']+)'/;

/**
 * @class SnpmbAuthManager
 */
export class SnpmbAuthManager {
	/**
	 * @constructor
	 * @param params SNPMB Client Params
	 */
	constructor(
		protected $http: AxiosInstance,
		private readonly params: SnpmbClientParams,
	) {}
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

		const response = await this.$http
			.post(SNPMB_SIGN_URL, Object.fromEntries(payload), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			.catch((err) => err.response);

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
					return true;
				})
				.catch(() => false);
		}

		// Safe logout = logout using real flow
		const dashboardParsedUrl = new URL(this.params.snpmb?.dashboardUrl ?? SNPMB_DASHBOARD_URL);
		const logoutAuthUrl = new URL('./auth/logout', dashboardParsedUrl.origin);

		const response = await this.$http.get(logoutAuthUrl.href).catch((e) => e.response);
		const finalUrl = new URL(`./${response.request.path}`, `https://${response.request.host}`)
			.href;

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

			await this.$http.get(logoutUrl).catch((e) => e.response);
			return true;
		}

		return false;
	}

	/**
	 * Get current sign SSO url
	 * @param dashboardUrl Portal SNPMB URL
	 * @return {Promise<string>}
	 */
	protected async getCurrentSsoUrl(
		dashboardUrl = this.params.snpmb?.dashboardUrl ?? SNPMB_DASHBOARD_URL,
	): Promise<string> {
		const response = await this.$http.get(dashboardUrl);

		return new URL(`./${response.request.path}`, `https://${response.request.host}`).href;
	}
}
