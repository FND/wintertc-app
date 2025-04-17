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

/** @returns {Response} */
export function http404() {
	return new Response("404 Not Found\n", {
		status: 404,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

/**
 * @param {Request["body"]} body
 * @returns {Promise<URLSearchParams>}
 */
export async function formData(body) {
	if (!body) {
		return new URLSearchParams();
	}

	let res = [];
	let decoder = new TextDecoder();
	for await (let chunk of body) {
		res.push(decoder.decode(chunk));
	}
	return new URLSearchParams(res.join(""));
}

/** @import { Route } from "./route.js" */
