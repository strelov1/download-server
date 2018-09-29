/**
 * Simple Router
 * @param {Request} request
 * @param {Response} response
 * @param {string} route
 * @param {(request : Request, response : Response) => void} callback
 */
class Router {
    /**
     * @param {Request} request
     * @param {Response} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.routers = [];
    }

    /**
     * Add route with method GET
     * @param {string} route
     * @param {(request: Request, response: Response) => void} callback
     */
    get(route, callback) {
        this.routers.push({
            method: "GET",
            path: route,
            callback
        });
    }

    /**
     * Add route with method POST
     * @param {string} route
     * @param {(request: Request, response: Response) => void} callback
     */
    post(route, callback) {
        this.routers.push({
            method: "POST",
            path: route,
            callback
        });
    }

    /**
     * Find mathc Route and handle request
     */
    run() {
        const url = this.request.url.split("?")[0];
        const matchRoute = this.routers.find(
            route => route.method === this.request.method && route.path === url
        );

        if (matchRoute) {
            return matchRoute.callback(this.request, this.response);
        }

        return this.response.error(`No match route ${url}`);
    }
}

module.exports = Router;
