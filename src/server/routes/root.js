import { ROUTES } from "../config.js";
import { document } from "./template.js";
import { html } from "../html.js";
import { formData } from "../http/index.js";

/** @type {Map<string, string | null>} */
let STORE = new Map();

/** @type {string} */
let ROOT_URL;
/** @type {Route} */
let ASSET_ROUTE;

export default {
	GET: show,
	POST: update,
};

/** @returns {Response} */
function show() {
	ROOT_URL ??= /** @type {Route} */ (ROUTES.get("root")).url().toString();
	ASSET_ROUTE ??= /** @type {Route} */ (ROUTES.get("asset"));

	let title = "Items";
	// deno-fmt-ignore
	let doc = document({
		lang: "en",
		title,
	}, html`
<link rel="stylesheet"${{
	href: ASSET_ROUTE.url({ filename: "main.css" }).toString()
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
	return new Response(null, {
		status: 302,
		headers: {
			Location: ROOT_URL,
		},
	});
}

/** @import { Route } from "../route.js" */
