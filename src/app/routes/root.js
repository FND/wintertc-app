import { ROUTER } from "../config.js";
import { document } from "../doc.js";
import { html } from "../../lib/html.js";
import { formData, http302 } from "../../lib/http/index.js";

/** @type {Map<string, string | null>} */
let STORE = new Map();

/** @type {string} */
let ROOT_URL;
/** @type {Route["url"]} */
let ASSET_URL;

export default {
	GET: show,
	POST: update,
};

/** @returns {Response} */
function show() {
	ROOT_URL ??= ROUTER.get("root")().toString();
	ASSET_URL ??= ROUTER.get("asset");

	let title = "Items";
	// deno-fmt-ignore
	let doc = document({
		lang: "en",
		title,
	}, html`
<link rel="stylesheet"${{
	href: ASSET_URL({ filename: "main.css" }).toString()
}}>
	`, html`
<h1>${title}</h1>

<form method="post"${{ action: ROOT_URL }}>
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
	return http302(ROOT_URL);
}

/** @import { Route } from "../../lib/route.js" */
