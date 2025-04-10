import { serveStatic } from "./static.js";
import { Route } from "./route.js";
import { readableStream } from "./adaptor.js";

let TEMPLATE = new URL("./template.html", import.meta.url).pathname;
let ROUTES = [
	new Route("root", "/", {
		GET: async () => {
			let html = await readableStream(TEMPLATE);
			return new Response(html, {
				status: 200,
				headers: {
					"Content-Type": "text/html",
				},
			});
		},
	}),
	new Route("assets", "/assets/:filename", {
		GET: (_req, { filename }) => filename ? serveStatic(filename) : null,
	}),
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
