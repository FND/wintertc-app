import rootHandlers from "./routes/root.js";
import * as articleHandlers from "./routes/articles.js";
import assetHandlers from "./routes/assets.js";
import { Route } from "./route.js";
import { http404 } from "./util.js";

let ROUTES = [
	new Route("root", "/", rootHandlers),
	new Route("asset", "/assets/:filename", assetHandlers),
	new Route("articles", "/articles", articleHandlers.collection),
	new Route("article", "/articles/:slug", articleHandlers.entity),
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
	return http404();
}
