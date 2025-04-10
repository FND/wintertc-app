import { encodeHTML, formData } from "../util.js";
import { readableStream } from "../adaptor.js";

let TEMPLATE = "./template.html";

TEMPLATE = new URL(TEMPLATE, import.meta.url).pathname;
TEMPLATE = await new Response(await readableStream(TEMPLATE)).text();
let STORE = new Map();

export default {
	GET: show,
	POST: update,
};

/** @returns {Response} */
function show() {
	// XXX: crude templating
	let items = STORE.entries().map(([name, desc]) => {
		return `<dt>${encodeHTML(name)}</dt><dd>${encodeHTML(desc)}</dd>`;
	});
	let html = `<dl>${[...items].join("\n")}</dl>`;
	html = TEMPLATE.replace("</body>", html);

	return new Response(html, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
		},
	});
}

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
async function update(req) {
	let data = await formData(req.body);
	let name = data.get("name");
	if (name) {
		STORE.set(name, data.get("desc"));
	}
	return new Response(null, {
		status: 302,
		headers: {
			Location: req.url, // XXX: crude
		},
	});
}
