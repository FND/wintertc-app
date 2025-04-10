import rootHandlers from "./routes/root.js";
import assetHandlers from "./routes/assets.js";
import { Route } from "./route.js";

let ROUTES = [
	new Route("root", "/", rootHandlers),
	new Route("assets", "/assets/:filename", assetHandlers),
];

/**
 * @param {Request} req
 * @returns {Response | Promise<Response>}
 */
export function dispatch(req) {
	for (let route of ROUTES) {
		let res = route.dispatch(req); // TODO: error handling (HTTP 500)
		if (res) {
			return res;
		}
	}

	return new Response("404 Not Found\n", {
		status: 404,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
