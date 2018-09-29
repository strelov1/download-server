const http = require("http");
const https = require("https");

/**
 * Simple http client
 */
class Client {
    contructor() {
        this.headers = [];
        this.httpClient = null;
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
     * Send Get
     * @param {string} url
     */
    get(url) {
        return this.request(url, "GET");
    }

    request(url, method) {
        return new Promise((resolve, reject) => {
            if (url.indexOf("https://") === 0) {
                this.httpClient = https;
            } else if (url.indexOf("http://") === 0) {
                this.httpClient = http;
            } else {
                throw new Error("Not Url");
            }
            // Set Headers @TODO HEADERS
            const options = { method };
            this.httpClient.get(url, options, result => {
                if (result.statusCode !== 200) {
                    reject(new Error()`Server return code: ${result.statusCode}`);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Client;
