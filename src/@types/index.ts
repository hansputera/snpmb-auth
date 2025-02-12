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
