const http = require("http");
const url = require("url");

const Router = require("./router");
const Middleware = require("./middleware");
const Client = require("./client");

/**
 * File Download Handler
 * @param {Request} request
 * @param {Response} response
 */
function mainHandler(request, response) {
    response.send("Main Page");
}
/**
 * File Download Handler
 * @param {Request} request
 * @param {Response} response
 */
function getFileHandler(request, response) {
    var downloadUrl = url.parse(request.url, true).query.url;
    if (downloadUrl && typeof downloadUrl === "string") {
        new Client()
            // Proxy Request Headers
            .setHeaders({
                ...request.headers,
                host: downloadUrl
            })
            .get(downloadUrl)
            .then(responseDownladStream => {
                const fileName = downloadUrl.split("/").reverse()[0] || "file";
                // Proxy Response Headers
                response.setHeaders({
                    ...responseDownladStream.headers,
                    "Content-disposition": `attachment; filename='${fileName}'`
                });
                // send DownladStream to response
                responseDownladStream.pipe(response);
            })
            .catch(response.error);
    } else {
        response.error("Not url in query params");
    }
}

const server = http.createServer((request, response) => {
    // Add Response Helpers
    Middleware.responseWraper(response);

    const router = new Router(request, response);

    router.get("/", mainHandler);
    router.get("/getfile", getFileHandler);

    router.run();
});

server.listen(8000);