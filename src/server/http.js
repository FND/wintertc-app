import { serveStatic } from "./static.js";
import { readableStream } from "./adaptor.js";

let ROUTES = {
	root: new URLPattern({
		pathname: "/",
	}),
	assets: new URLPattern({
		pathname: "/assets/:filename",
	}),
};

let TEMPLATE = new URL("./template.html", import.meta.url).pathname;

/**
 * @param {{ url: Request["url"] }} req
 * @returns {Promise<Response>}
 */
export async function handleRequest({ url }) {
	if (ROUTES.root.test(url)) {
		let html = await readableStream(TEMPLATE);
		return new Response(html, {
			status: 200,
			headers: {
				"Content-Type": "text/html",
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
