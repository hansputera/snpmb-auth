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
		 * SNPMB PDSS Service Url
		 */
		pdssUrl?: string;

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

export type SnpmbStudentVervalData = {
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
	snpmb_status_pendaftaran: StatusPendaftaran;
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

export type SnpmbVervalUserInfoData = {
	roles: Array<string>;
	reg_id: string;
	access_token: string;
	iss: string;
	sub: string;
	exp: number;
};

export type SnpmbVervalSchoolVervalData = {
	sekolah_id: string;
	kode_registrasi: string;
	npsn: string;
	nama: string;
	status_sekolah_id: string;
	status_sekolah: string;
	alamat_jalan: string;
	rt: number;
	rw: number;
	desa_kelurahan: string;
	kode_wilayah: string;
	kecamatan: string;
	kode_wilayah_kab: string;
	kabupaten: string;
	kode_wilayah_prop: string;
	propinsi: string;
	kode_pos: string;
	bentuk_pendidikan_id: number;
	bentuk_pendidikan: string;
	status_kepemilikan_id: number;
	status_kepemilikan: string;
	akreditasi: string;
	nilai_akreditasi: string;
	tahun_akreditasi: string;
	no_sk_akreditasi: string;
	tgl_sk_akreditasi: string;
	tmt_mulai: string;
	tmt_selesai: string;
	last_sync_akreditasi: string;
	last_update: string;
	nama_ks: string;
	no_hp: string;
	alamat_jalan_ks: string;
	jurusan: Array<{
		jml_pd: number;
		jurusan: string;
		jurusan_id: string;
		nisn_valid: number;
	}>;
	snpmb_date_created: string;
	snpmb_email: string;
	snpmb_last_sync_pusdatin: string;
	user_id: string;
};

export enum StatusPendaftaran {
	Permanent = 2,
	Registered = 1,
	NotRegistered = 0,
}

export type SnpmbVervalStudentData = {
	nisn: string;
	nama: string;
	snpmb_status_pendaftaran: StatusPendaftaran;
};

export type SnpmbPdssSchoolProfileData = {
	school_id: string;
	npsn: string;
	name: string;
	type: string;
	ownership: string;
	accreditation: string;
	address_street: string;
	address_city: string;
	address_province: string;
	address_postal_code: string;
	is_information_finalized: boolean;
	information_finalized_at: number;
	is_student_finalized: boolean;
	student_finalized_at: number;
	is_score_finalized: boolean;
	score_finalized_at: number;
	is_curriculum_finalized: boolean;
	curriculum_finalized_at: number;
	information_finalized_by: string;
	student_finalized_by: string;
	curriculum_finalized_by: string;
	score_finalized_by: string;
	allow_score: boolean;
	allow_curr: boolean;
	last_updated: number;
	is_information_unfinalize_allowed: boolean;
	is_student_unfinalize_allowed: boolean;
	is_curriculum_unfinalize_allowed: boolean;
	profile_unfinalized_at: number;
	can_use_erapor: unknown; // Need further action (I dont know what kind of data it's because my school didnt use erapor in 2025)
	is_erapor_enabled: boolean;
};

export type SnpmbPdssHeadmasterData = {
	school_id: string;
	headmaster_name: string;
	headmaster_phone: string;
	headmaster_address: string;
};
