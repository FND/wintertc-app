import { http404 } from "../http/index.js";

/**
 * @param {Route[]} routes
 * @param {Request} req
 * @returns {Response | Promise<Response>}
 */
export function dispatch(routes, req) {
	for (let route of routes) {
		let res = route.dispatch(req); // TODO: error handling (HTTP 500)
		if (res) {
			return res;
		}
	}
	return http404();
}

/** @import { Route } from "./route.js" */
