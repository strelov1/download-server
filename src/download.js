const Client = require("./client");

function download(url, headers, response) {
    return (
        new Client()
            // Proxy Request Headers
            .setHeaders({
                ...headers,
                host: url
            })
            .get(url)
            .then(responseDownladStream => {
                const fileName = url.split("/").reverse()[0] || "file";
                // Proxy Response Headers
                response.setHeaders({
                    ...responseDownladStream.headers,
                    "Content-disposition": `attachment; filename='${fileName}'`
                });
                // Send DownladStream to response
                return responseDownladStream.pipe(response);
            })
            .catch(error => {
                console.log(error);
                return response.error(error);
            })
    );
}

module.exports = download;
