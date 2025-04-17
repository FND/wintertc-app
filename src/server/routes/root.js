import { document } from "./template.js";
import { html } from "../html.js";
import { formData } from "../http.js";

/** @type {Map<string, string | null>} */
let STORE = new Map();

export default {
	GET: show,
	POST: update,
};

/** @returns {Response} */
function show() { // XXX: hard-coded URIs
	let title = "Items";
	// deno-fmt-ignore
	let doc = document({
		lang: "en",
		title,
	}, html`
<link rel="stylesheet" href="/assets/main.css">
	`, html`
<h1>${title}</h1>

<form action="/" method="post">
	<label>
		<b>Name</b>
		<input type="text" name="name">
	</label>
	<label>
		<b>Description</b>
		<textarea name="desc"></textarea>
	</label>
	<button>Submit</button>
</form>

<dl>${STORE.entries().map(([name, desc]) => {
	return html`<dt>${name}</dt><dd>${desc ?? "—"}</dd>`;
})}</dl>
	`);
	return new Response(doc.toString(), {
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
		STORE.set(name, data.get("desc") || null);
	}
	return new Response(null, {
		status: 302,
		headers: {
			Location: req.url, // XXX: crude
		},
	});
}
