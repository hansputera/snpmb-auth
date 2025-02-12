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

        dashboardUrl?: string;
        signUrl?: string;

        /**
         * SNPMB Cookie file name (e.g. /tmp/cookie-1.json)
         * @default /tmp/cookies-snpmb.json
         */
        cookieFile?: string;
    };
}

export type SnpmbVervalParams = {
    url: string;
    token: string;
}

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
}
