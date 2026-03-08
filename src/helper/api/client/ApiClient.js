class ApiClient {
    constructor(baseUrl, defaultHeaders = {}) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.defaultHeaders = defaultHeaders;
    }

    buildUrl(path) {
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;
        return `${this.baseUrl}${normalizedPath}`;
    }

    async request(method, path, { headers = {}, body } = {}) {
        const url = this.buildUrl(path);
        const finalHeaders = { ...this.defaultHeaders, ...headers };
        const startedAt = Date.now();

        const response = await fetch(url, {
            method,
            headers: finalHeaders,
            body: body ? JSON.stringify(body) : undefined
        });

        const text = await response.text();
        let jsonBody;

        try {
            jsonBody = text ? JSON.parse(text) : {};
        } catch (e) {
            jsonBody = { raw: text };
        }

        return {
            request: {
                method,
                url,
                headers: finalHeaders,
                body: body || null
            },
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            body: jsonBody,
            durationMs: Date.now() - startedAt
        };
    }

    async get(path, options = {}) {
        return this.request("GET", path, options);
    }

    async post(path, body, options = {}) {
        return this.request("POST", path, { ...options, body });
    }
}

module.exports = { ApiClient };
