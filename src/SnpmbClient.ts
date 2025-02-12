import type { SnpmbClientParams } from "./@types/index.js";
import { SnpmbAuthManager } from "@/SnpmbAuthManager.js";

/**
 * @class SnpmbClient
 */
export class SnpmbClient
{
    public authManager!: SnpmbAuthManager;

    /**
     * @constructor
     * @param params SNPMB Client Auth Params
     */
    constructor(private readonly params: SnpmbClientParams) {
        this.authManager = new SnpmbAuthManager(this, params);
    }
}