const http = require("http");
const https = require("https");
const url = require("url");

/**
 * Simple http client
 */
class Client {
    constructor() {
        this.headers = [];
        this.options = { followLocation: true, locationCount: 2 };
        this.countLoaction = 0;
    }

    /**
     * Settgin Headers
     * @param {object} headers
     */
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }

    /**
     * Settgin Options
     * @param {object} options
     */
    setOptions(options) {
        this.options = { ...this.options, options };
        return this;
    }

    /**
     * Send GET request
     * @param {string} requestUrl
     */
    get(requestUrl) {
        return this.request(requestUrl, { method: "GET" });
    }

    /**
     * Send POST request
     * @param {string} requestUrl
     * @param {object} data
     */
    post(requestUrl, data) {
        return this.request(requestUrl, { method: "POST", data });
    }

    /**
     * Send PUT request
     * @param {string} requestUrl
     * @param {object} data
     */
    put(requestUrl, data) {
        return this.request(requestUrl, { method: "PUT", data });
    }

    /**
     * Send DELETE request
     * @param {string} requestUrl
     */
    delete(requestUrl) {
        return this.request(requestUrl, { method: "DELETE" });
    }

    /**
     * Send PATCH request
     * @param {string} requestUrl
     */
    path(requestUrl) {
        return this.request(requestUrl, { method: "PATCH" });
    }

    /**
     * Send HEAD request
     * @param {string} requestUrl
     */
    head(requestUrl) {
        return this.request(requestUrl, { method: "HEAD" });
    }

    /**
     * Create http client
     * @param {string} requestUrl
     */
    static createClient(requestUrl) {
        if (requestUrl.indexOf("https://") === 0) {
            return https;
        }
        if (requestUrl.indexOf("http://") === 0) {
            return http;
        }
        throw new Error("Not correct url, your url must start http:// or https://");
    }

    /**
     * Prepare headers data
     * @param {string} requestUrl
     * @param {object} requestOptions
     */
    prepareHears(requestUrl, requestOptions) {
        // Set Headers @TODO HEADERS
        const urlData = url.parse(requestUrl, true);
        // correct resolve host examlpe.com:port
        const host = urlData.host.split(":")[0] || urlData.host;

        let defaultPort = 80;
        if (requestUrl.indexOf("https://") === 0) {
            defaultPort = 443;
        }
        const port = urlData.host.split(":")[1] || defaultPort;

        return {
            ...this.headers,
            method: requestOptions.method,
            port,
            host,
            path: urlData.path
        };
    }

    /**
     * Check follow location
     * @param {number} statusCode
     */
    isFollowLocation(statusCode) {
        return (
            this.options.followLocation &&
            this.locationCount < this.options.locationCount &&
            (statusCode === 301 || statusCode === 302)
        );
    }

    /**
     * Send request
     * @param {string} requestUrl
     * @param {options} requestOptions
     */
    request(requestUrl, requestOptions) {
        return new Promise((resolve, reject) => {
            const client = Client.createClient(requestUrl);
            const headers = this.prepareHears(requestUrl, requestOptions);

            const request = client.request(headers, result => {
                if (this.isFollowLocation(result.statusCode)) {
                    this.locationCount += 1;
                    this.request(result.headers.location, headers);
                } else if (result.statusCode !== 200) {
                    reject(new Error(`Server return code: ${result.statusCode}`));
                } else {
                    resolve(result);
                }
            });

            if (requestOptions.method === "POST" || requestOptions.method === "PUT") {
                request.write(requestOptions.data);
            }

            request.on("error", error => {
                reject(error);
            });
            request.end();
        });
    }
}

module.exports = Client;
