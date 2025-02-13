import type { SnpmbClientParams, SnpmbVervalData, SnpmbVervalParams } from '@/@types/index.js';
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

	public async fetchInfo(): Promise<SnpmbVervalData | undefined> {
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
		return response.data?.data as SnpmbVervalData;
	}

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
