import { tmpdir } from "node:os";
import path from "node:path";

/**
 * SNPMB Dashboard URL
 */
export const SNPMB_DASHBOARD_URL = 'https://portal-snpmb.bppp.kemdikbud.go.id/dashboard';

/**
 * SNPMB Sign URL
 */
export const SNPMB_SIGN_URL = 'https://sso-snpmb.bppp.kemdikbud.go.id/signin';

/**
 * SNPMB Verval URL
 */
export const SNPMB_VERVAL_URL = 'https://verval-snpmb.bppp.kemdikbud.go.id';

/**
 * SNPMB Cookie Path
 */
export const DEFAULT_SNPMB_COOKIE_FILE = path.join(tmpdir(), 'snpmb-cookies.json');
