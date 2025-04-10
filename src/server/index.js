import { serveStatic } from "./static.js";
import { serve } from "./adaptor.js";

let ROUTES = {
	root: new URLPattern({
		pathname: "/",
	}),
	assets: new URLPattern({
		pathname: "/assets/:filename",
	}),
};

/**
 * @param {Request} req
 * @returns {Response | Promise<Response>}
 */
function handleRequest({ url }) {
	if (ROUTES.root.test(url)) {
		return new Response("hello world", {
			status: 200,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}

	let asset = ROUTES.assets.exec(url)?.pathname.groups.filename;
	if (asset) {
		return serveStatic(asset);
	}

	return new Response("Not Found", {
		status: 404,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

serve(8000, handleRequest);
