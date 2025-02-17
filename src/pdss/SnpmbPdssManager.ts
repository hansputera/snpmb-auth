import type {
	SnpmbClientParams,
	SnpmbPdssHeadmasterData,
	SnpmbPdssMajorData,
	SnpmbPdssSchoolProfileData,
	SnpmbPdssScoreSemesterData,
	SnpmbPdssStudentData,
} from '@/@types/index.js';
import { SNPMB_PDSS_URL } from '@/const.js';
import type { AxiosInstance } from 'axios';

/**
 * ### Short explanation of PDSS Service
 *
 * I don't know if there is a clone or copy between the SNBP and PDSS services.
 * The authentication flow of the PDSS service is the same as the SNBP service; there are no differences in authentication.
 * Let's say if you want to copy the SNBP service flows to the PDSS service, you should change "snmptn" to "pdss" in every code or endpoint name.
 *
 * @author Hanif Dwy Putra S <hanifdwyputrasembiring@gmail.com>, <hanifdwyputras@mail.sman3palu.sch.id>
 */

export class SnpmbPdssManager {
	protected $pdssToken = '';

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
	 * Get School PDSS Profile
	 * @return {Promise<SnpmbPdssSchoolProfileData | undefined>}
	 */
	public async getSchoolProfile(): Promise<SnpmbPdssSchoolProfileData | undefined> {
		return this.$fetch('/api/v2/pdss/school/profile/get');
	}

	/**
	 * Get school headmaster profile data from PDSS service
	 * @return {Promise<SnpmbPdssHeadmasterData | undefined>}
	 */
	public async getSchoolHeadmaster(): Promise<SnpmbPdssHeadmasterData | undefined> {
		return this.$fetch('/api/v2/pdss/school/headmaster/get');
	}

	/**
	 * Get Major List from School
	 * @return {Promise<SnpmbPdssMajorData[] | undefined>}
	 */
	public async getMajorList(): Promise<SnpmbPdssMajorData[] | undefined> {
		return this.$fetch<{
			majors: SnpmbPdssMajorData[];
		}>('/api/v2/pdss/school/major/list').then((resp) => resp?.majors);
	}

	/**
	 * Get student list by major code
	 * @param {string} majorCode Major code (from .getMajorList method)
	 * @return {Promise<SnpmbPdssStudentData[] | undefined>}
	 */
	public async getStudentListByMajor(
		majorCode: string,
	): Promise<SnpmbPdssStudentData[] | undefined> {
		return this.$fetch<{
			students: SnpmbPdssStudentData[];
		}>('/api/v2/pdss/student/major/list?major_code='.concat(majorCode)).then(
			(resp) => resp?.students,
		);
	}

	/**
	 * Get scores semester student
	 * @param {string} studentId Student ID
	 * @return {Promise<SnpmbPdssScoreSemesterData[] | undefined>}
	 */
	public async getScoresSemesterByStudent(
		studentId: string,
	): Promise<SnpmbPdssScoreSemesterData[] | undefined> {
		return this.$fetch<{
			score_semesters: SnpmbPdssScoreSemesterData[];
		}>('/api/v2/pdss/student/score/list?student_id='.concat(studentId)).then(
			(resp) => resp?.score_semesters,
		);
	}

	/**
	 * Generate PDSS Service Token
	 * @return {Promise<string>}
	 */
	public async getPdssToken(): Promise<string | undefined> {
		const response = await this.$http.get(
			new URL('./api/v2/login/pdss', this.params.snpmb?.pdssUrl ?? SNPMB_PDSS_URL).href,
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
				'./api/v2/oauth-callback/pdss',
				this.params.snpmb?.pdssUrl ?? SNPMB_PDSS_URL,
			);
			oauthUrl.searchParams.set('code', code);
			oauthUrl.searchParams.set('state', state);

			// Doing login
			const oauthResponse = await this.$http.get(oauthUrl.href);
			const cookies = oauthResponse.headers['set-cookie'];
			const token = cookies?.at(0)?.split(';').at(0)?.replace('token=', '').trim();

			if (token) {
				this.$pdssToken = token;
				return token;
			}
		}

		return undefined;
	}

	protected async $fetch<T>(endpoint: string): Promise<T | undefined> {
		if (!this.$pdssToken.length) {
			throw new Error('Missing PDSS Token');
		}

		const response = await this.$http.get(
			new URL(`.${endpoint}`, this.params.snpmb?.pdssUrl ?? SNPMB_PDSS_URL).href,
			{
				headers: {
					Authorization: `Bearer ${this.$pdssToken}`,
				},
			},
		);

		if (response.status === 200) {
			return response.data as T;
		}

		return undefined;
	}
}
