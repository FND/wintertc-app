import { readableStream } from "../adaptor.js";

let TEMPLATE = new URL("./template.html", import.meta.url).pathname;

export default {
	GET: show,
};

/** @returns {Promise<Response>} */
async function show() {
	let html = await readableStream(TEMPLATE);
	return new Response(html, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
		},
	});
}
