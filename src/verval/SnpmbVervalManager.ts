import type {
	SnpmbClientParams,
	SnpmbSnbpUserInfoData,
	SnpmbStudentVervalData,
	SnpmbVervalParams,
	SnpmbVervalSchoolVervalData,
	SnpmbVervalStudentData,
	SnpmbVervalUserInfoData,
} from '@/@types/index.js';
import { SNPMB_VERVAL_URL } from '@/const.js';
import type { AxiosInstance } from 'axios';

const INDEX_CHUNK_REG =
	/<script[^>]*\s+src=["'](\/_next\/static\/chunks\/pages\/index[^"']+)["'][^>]*>/g;
const URL_REG =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

export class SnpmbVervalManager {
	protected $vervalParams!: SnpmbVervalParams;

	constructor(
		protected $http: AxiosInstance,
		protected params: SnpmbClientParams,
	) {}

	/**
	 * Get general information of verval snpmb user info
	 * @return {Promise<SnpmbSnbpUserInfoData | undefined>}
	 */
	public async fetchInfo(): Promise<SnpmbVervalUserInfoData | undefined> {
		if (!(this.$vervalParams.url || this.$vervalParams.token)) {
			throw new Error('Missing Verval Params');
		}

		const response = await this.$http.get(
			new URL('./api/userinfo', this.$vervalParams.url).href,
			{
				headers: {
					Authorization: `Bearer ${this.$vervalParams.token}`,
				},
			},
		);

		return response.data.data as SnpmbVervalUserInfoData | undefined;
	}

	/**
	 * Retrieve list of student in school
	 *
	 * **NOTE:** Only school account is allowed to access this resource
	 * @return {Promise<SnpmbStudentVervalData[] | undefined>}
	 */
	public async fetchStudentList(): Promise<SnpmbVervalStudentData[] | undefined> {
		if (!(this.$vervalParams.url || this.$vervalParams.token)) {
			throw new Error('Missing Verval Params');
		}

		const response = await this.$http.get(
			new URL('./api/sekolah/verval/listsiswa', this.$vervalParams.url).href,
			{
				headers: {
					Authorization: `Bearer ${this.$vervalParams.token}`,
				},
			},
		);

		return response.data.data as SnpmbStudentVervalData[] | undefined;
	}

	/**
	 * Get student information of verval snpmb data
	 *
	 * **NOTE**: You should use student account to access this resource
	 * @return {Promise<SnpmbStudentVervalData | undefined>}
	 */
	public async fetchStudentInfo(): Promise<SnpmbStudentVervalData | undefined> {
		if (!(this.$vervalParams.url || this.$vervalParams.token)) {
			throw new Error('Missing Verval Params');
		}

		const response = await this.$http.get(
			new URL('./api/siswa/verval', this.$vervalParams.url).href,
			{
				headers: {
					Authorization: `Bearer ${this.$vervalParams.token}`,
				},
			},
		);

		return response.data?.data as SnpmbStudentVervalData;
	}

	/**
	 * Get school information of verval snpmb data
	 *
	 * **NOTE:** You should use school account to access this resource
	 * @return {Promise<SnpmbVervalSchoolVervalData | undefined>}
	 */
	public async fetchSchoolInfo(): Promise<SnpmbVervalSchoolVervalData | undefined> {
		if (!(this.$vervalParams.url || this.$vervalParams.token)) {
			throw new Error('Missing Verval Params');
		}

		const response = await this.$http.get(
			new URL('./api/sekolah/verval', this.$vervalParams.url).href,
			{
				headers: {
					Authorization: `Bearer ${this.$vervalParams.token}`,
				},
			},
		);

		return response.data?.data as SnpmbVervalSchoolVervalData;
	}

	/**
	 * Second flow of available all action registered on SNPMB Verval Manager
	 *
	 * This method is used to extract JWT Token from Verval SNPMB Service
	 * @return {Promise<string | undefined>}
	 */
	public async getVervalToken(): Promise<string | undefined> {
		if (!this.$vervalParams?.url) {
			throw new Error('Missing Verval SNPMB URL');
		}

		const loginResponse = await this.$http.get(new URL('./login', this.$vervalParams.url).href);
		if (loginResponse.request.path.startsWith('/auth/callback')) {
			const callbackParsedUrl = new URL(
				`.${loginResponse.request.path}`,
				`https://${loginResponse.request.host}`,
			);

			const callbackCode = callbackParsedUrl.searchParams.get('code');
			const stateCode = callbackParsedUrl.searchParams.get('state');

			if (!(callbackCode && stateCode)) {
				return undefined;
			}

			const callbackUrl = new URL('./callback', this.$vervalParams.url);
			callbackUrl.searchParams.set('code', callbackCode);
			callbackUrl.searchParams.set('state', stateCode);
			callbackUrl.searchParams.set('session_state', 'undefined');

			const callbackResponse = await this.$http.get(callbackUrl.href);
			const token = callbackResponse.data.data?.token;

			if (token) {
				this.$vervalParams = {
					...this.$vervalParams,
					token,
				};

				return token;
			}
		}

		return undefined;
	}

	/**
	 * First flow of all method on Verval SNPMB Manager
	 *
	 * Why we can't define it manually? Because the Verval SNPMB service url isnt static (dynamic url).
	 * They're using google cloud functions to deploy the service (.run.app domain)
	 * @return {Promise<string | undefined>}
	 */
	public async getVervalApiUrl(): Promise<string | undefined> {
		// Extract index chunk page
		const vervalFirstResponse = await this.$http.get(
			this.params.snpmb?.vervalUrl ?? SNPMB_VERVAL_URL,
		);
		const scriptChunks = INDEX_CHUNK_REG.exec(vervalFirstResponse.data);

		const chunkIndexUrl = scriptChunks?.at(1);

		if (!chunkIndexUrl) {
			return undefined;
		}

		// Extracting verval snpmb API
		const chunkResponse = await this.$http.get(
			new URL(`./${chunkIndexUrl}`, this.params.snpmb?.vervalUrl ?? SNPMB_VERVAL_URL).href,
		);
		const vervalApiUrl = URL_REG.exec(chunkResponse.data)?.at(0);

		if (!vervalApiUrl) {
			return undefined;
		}

		this.$vervalParams = {
			...this.$vervalParams,
			url: vervalApiUrl,
		};

		return vervalApiUrl;
	}
}
