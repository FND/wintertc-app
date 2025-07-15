import { http404 } from "../../lib/http/index.js";

/** @type {Record<string, string>} */
let STORE = {
	"hello-world": "Hello World",
	lipsum: "Lipsum",
};

export let collection = {
	GET: list,
};
export let entity = {
	GET: show,
};

/** @returns {Response} */
function list() {
	let txt = Object.entries(STORE)
		.map(([slug, title]) => `${slug}: ${title}`)
		.join("\n");
	return new Response(txt + "\n", {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

/**
 * @param {Request} _req
 * @param {PathParams} params
 * @returns {Response}
 */
function show(_req, { slug }) {
	let title = slug && STORE[slug];
	if (title === undefined) {
		return http404();
	}

	let txt = `
${title}
${"=".repeat(title.length)}

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	`.trim();
	return new Response(txt + "\n", {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

/** @import { PathParams } from "../../lib/routing/route.js" */
