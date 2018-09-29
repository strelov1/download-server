/**
 * ResponseMiddleware
 * @param {Response} response
 */
function responseWraper(response) {
    /**
     * Set default params
     */
    response.statusCode = 200;
    response.headers = {
        "Content-Type": "text/html; charset=utf-8"
    };
    /**
     * Response Status
     * @param {int} status
     */
    response.setStatus = status => {
        response.statusCode = status;
        return response;
    };

    /**
     * Set response Headers
     * @param {object} headers
     */
    response.setHeaders = headers => {
        response.headers = headers;
        Object.keys(headers).forEach(key => {
            response.setHeader(key, headers[key]);
        });
        return response;
    };
    /**
     * Default Send Content
     * @param {any} content
     */
    response.send = content => {
        response.writeHead(response.statusCode, response.headers);
        response.end(content);
        return response;
    };
    /**
     * Default Send Error
     * @param {string} msg
     */
    response.error = msg => {
        response.setStatus(500);
        if (msg instanceof Error) {
            return response.send(msg.message);
        }
        return response.send(msg);
    };

    return response;
}

module.exports = { responseWraper };
