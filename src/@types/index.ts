export type SnpmbClientParams = {
	/**
	 * SNPMB Email
	 */
	email: string;
	/**
	 * SNPMB Password
	 */
	password: string;

	/**
	 * SNPMB Client Settings
	 */
	snpmb?: {
		/**
		 * SNPMB Verval URL
		 */
		vervalUrl?: string;
		/**
		 * SNPMB Dashboard URL
		 */
		dashboardUrl?: string;
		/**
		 * SNPMB SIGN URL
		 */
		signUrl?: string;
		/**
		 * SNPMB SNBP Service URL
		 */
		snpbUrl?: string;

		/**
		 * SNPMB Cookie file name (e.g. /tmp/cookie-1.json)
		 * @default /tmp/cookies-snpmb.json
		 */
		cookieFile?: string;
	};
};

export type SnpmbVervalParams = {
	url: string;
	token: string;
};

export type SnpmbVervalData = {
	peserta_didik_id: string;
	nisn: string;
	npsn: string;
	sekolah: string;
	nik: string;
	nama: string;
	tempat_lahir: string;
	tanggal_lahir: string;
	jenis_kelamin: string;
	alamat_jalan: string;
	rt: number;
	rw: number;
	desa_kelurahan: string;
	jurusan_id: string;
	jurusan: string;
	kecamatan: string;
	kode_kecamatan: string;
	kabupaten: string;
	kode_kabupaten: string;
	propinsi: string;
	kode_propinsi: string;
	kode_pos: string;
	no_hp: string;
	email: string;
	agama_id: number;
	agama: string;
	kebutuhan_khusus: string;
	tanggal_masuk_sekolah: string;
	jenis_keluar: string;
	tahun_lulus: string;
	jumlah_tanggungan: number;
	penghasilan_ayah: string;
	penghasilan_ibu: string;
	snpmb_status_pendaftaran: number;
	snpmb_email: string;
	snpmb_last_sync_pusdatin: string;
	tanggal_permanen: string;
	user_id: string;
	last_update: string;
};

export interface SnpmbSnbpFinalizeData {
	student_id: string;
	is_finalized: boolean;
	finalized_at?: number;
	finalized_by?: string;
	registration_number: string;
}

export type SnpmbSnbpUserInfoData = {
	name: string;
	enabled: boolean;
	picture: string;
	zoneinfo: string;
	locale: string;
	reg_id: string;
	updated_at: string;
	preferred_username: string;
	sub: string;
	profile: string;
	email: string;
	alternate_email: string;
	email_verified: boolean;
	alternate_email_verified: boolean;
	phone: string;
	phone_verified: boolean;
	group: Array<{
		group_id: string;
		group_name: string;
	}>;
	optional: {
		is_active: boolean;
		is_eligible: boolean;
		is_permanent: boolean;
	};
};

export type SnpmbSnbpProfileData = {
	student_id: string;
	major_code: string;
	major_name: string;
	school_id: string;
	npsn: string;
	school_name: string;
	nisn: string;
	entrance_year: number;
	name: string;
	nik: string;
	gender_code: string;
	place_of_birth: string;
	date_of_birth: number;
	religion: string;
	email: string;
	phone: string;
	kip_number: string;
	kip_registration_date: number;
	address_street: string;
	address_rt: string;
	address_rw: string;
	address_sub_district: string;
	address_district: string;
	address_city: string;
	address_province: string;
	address_postal_code: string;
	is_permanent: boolean;
	permanent_at: number;
	photo_url: string;
	dependant_count: number;
	father_income_id: string;
	father_income_desc: string;
	mother_income_id: string;
	mother_income_desc: string;
};

export type SnpmbSnbpUniversityList = Array<{
	university_id: string;
	name: string;
	province: string;
}>;

export type SnpmbSnbpUniversityProgramList = Array<{
	program_id: string;
	name: string;
	quota: number;
	is_allowed_major: boolean;
	portfolio_type_code: string;
	degree: string;
}>;

export type SnpmbSnbpStudentProgramData = {
	student_id: string;
	first_choice: {
		university_id: string;
		university_name: string;
		program_id: string;
		program_name: string;
		portfolio_type_code: string;
		degree: string;
	};
	second_choice: {
		university_id: string;
		university_name: string;
		program_id: string;
		program_name: string;
		portfolio_type_code: string;
		degree: string;
	};
};
