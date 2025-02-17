import type {
	SnpmbClientParams,
	SnpmbSnbpFinalizeData,
	SnpmbSnbpProfileData,
	SnpmbSnbpStudentProgramData,
	SnpmbSnbpUniversityList,
	SnpmbSnbpUniversityProgramList,
	SnpmbSnbpUserInfoData,
} from '@/@types/index.js';
import { SNPMB_SNBP_URL } from '@/const.js';
import type { AxiosInstance } from 'axios';

export class SnpmbSnbpManager {
	protected $snbpToken = '';

	/**
	 *
	 * @param {AxiosInstance} $http HTTP Client Axios
	 * @param {SnpmbClientParams} params SNPMB Client Parameters
	 */
	constructor(
		protected $http: AxiosInstance,
		protected params: SnpmbClientParams,
	) {}

	/**
	 * Get finalize status data from SNBP service
	 * @return {Promise<SnpmbSnbpFinalizeData | undefined>}
	 */
	public async fetchFinalizeStatus(): Promise<SnpmbSnbpFinalizeData | undefined> {
		return this.$fetch('/api/v2/snmptn/student/finalize/get/status');
	}

	/**
	 * Get user information from SNBP service
	 * @return {Promise<SnpmbSnbpUserInfoData | undefined>
	 */
	public async fetchUserInfo(): Promise<SnpmbSnbpUserInfoData | undefined> {
		return this.$fetch('/api/v2/snmptn/student/userinfo/get');
	}

	/**
	 * Get profile data from SNBP service
	 * @return {Promise<SnpmbSnbpProfileData | undefined>}
	 */
	public async fetchProfile(): Promise<SnpmbSnbpProfileData | undefined> {
		return this.$fetch('/api/v2/snmptn/studentprofile/get?force=false');
	}

	/**
	 * Get university list from SNBP service
	 * @return {Promise<SnpmbSnbpUniversityList | undefined>}
	 */
	public async fetchUniversityList(): Promise<SnpmbSnbpUniversityList | undefined> {
		return this.$fetch('/api/v2/snmptn/university/list');
	}

	/**
	 * Get program list from university
	 * @param {string} universityId University ID
	 * @return {Promise<SnpmbSnbpUniversityProgramList | undefined>}
	 */
	public async fetchUniversityPrograms(
		universityId: number,
	): Promise<SnpmbSnbpUniversityProgramList | undefined> {
		const response = await this.$fetch<{
			programs: SnpmbSnbpUniversityProgramList;
		}>(
			'/api/v2/snmptn/university/list/program?university_id='.concat(
				encodeURIComponent(universityId.toString()),
			),
		);

		return response?.programs;
	}

	/**
	 * Get student's program information
	 * @return {Promise<SnpmbSnbpStudentProgramData | undefined>}
	 */
	public async fetchStudentProgram(): Promise<SnpmbSnbpStudentProgramData | undefined> {
		return this.$fetch('/api/v2/snmptn/student/program/get');
	}

	/**
	 * Generate SNBP service token
	 * @return {Promise<string | undefined>}
	 */
	public async getSnbpToken(): Promise<string | undefined> {
		const response = await this.$http.get(
			new URL('./api/v2/login/snmptn', this.params.snpmb?.snpbUrl ?? SNPMB_SNBP_URL).href,
		);

		const responseParsedUrl = new URL(
			`.${response.request.path}`,
			`https://${response.request.host}`,
		);
		// Successfuly logged in
		if (responseParsedUrl.pathname.startsWith('/oauth-callback')) {
			const [code, state] = [
				responseParsedUrl.searchParams.get('code'),
				responseParsedUrl.searchParams.get('state'),
			];

			// Ensure the URL is safe to continue to next flow
			if (!(code && state)) {
				return undefined;
			}

			// Getting token from SNBPMB SNBP API Service
			const oauthUrl = new URL(
				'./api/v2/oauth-callback/snmptn',
				this.params.snpmb?.snpbUrl ?? SNPMB_SNBP_URL,
			);
			oauthUrl.searchParams.set('code', code);
			oauthUrl.searchParams.set('state', state);

			// Doing login
			const oauthResponse = await this.$http.get(oauthUrl.href);
			const cookies = oauthResponse.headers['set-cookie'];
			const token = cookies?.at(0)?.split(';').at(0)?.replace('token=', '').trim();

			if (token) {
				this.$snbpToken = token;
				return token;
			}
		}

		return undefined;
	}

	protected async $fetch<T>(endpoint: string): Promise<T | undefined> {
		if (!this.$snbpToken.length) {
			throw new Error('Missing SNBP Token');
		}

		const response = await this.$http.get(
			new URL(`.${endpoint}`, this.params.snpmb?.snpbUrl ?? SNPMB_SNBP_URL).href,
			{
				headers: {
					Authorization: `Bearer ${this.$snbpToken}`,
				},
			},
		);

		if (response.status === 200) {
			return response.data as T;
		}

		return undefined;
	}
}
