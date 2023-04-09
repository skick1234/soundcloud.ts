import { Pool } from "undici";
export default class API {
    clientID?: string;
    oauthToken?: string;
    static headers: {
        [key: string]: string;
    };
    api: Pool;
    apiV2: Pool;
    web: Pool;
    proxy?: Pool;
    constructor(clientID?: string, oauthToken?: string, proxy?: string);
    get headers(): {
        [key: string]: string;
    };
    /**
     * Gets an endpoint from the Soundcloud API.
     */
    get: (endpoint: string, params?: any) => Promise<any>;
    /**
     * Gets an endpoint from the Soundcloud V2 API.
     */
    getV2: (endpoint: string, params?: any) => Promise<any>;
    /**
     * Some endpoints use the main website as the URL.
     */
    getWebsite: (endpoint: string, params?: any) => Promise<any>;
    /**
     * Gets a URL, such as download, stream, attachment, etc.
     */
    getURL: (URI: string, params?: any) => Promise<any>;
    private readonly makeGet;
    post: (endpoint: string, params?: any) => Promise<any>;
    getClientID: (reset?: boolean) => Promise<string>;
    private readonly buildOptions;
    private readonly makeRequest;
}
