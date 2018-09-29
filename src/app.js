const http = require("http");
const url = require("url");

const Router = require("./router");
const Middleware = require("./middleware");
const download = require("./download");

/**
 * Main Page
 * @param {Request} request
 * @param {Response} response
 */
function mainHandler(request, response) {
    response.send("Main Page");
}
/**
 * File Download Page
 * @param {Request} request
 * @param {Response} response
 */
function getFileHandler(request, response) {
    const downloadUrl = url.parse(request.url, true).query.url;
    if (downloadUrl && typeof downloadUrl === "string") {
        download(downloadUrl, request.headers, response);
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

server.listen(8000, () => {
    console.log("Run server http://localhost:8000");
});
