import { ROUTES } from "./config.js";
import { dispatch } from "./http.js";
import { describe, it } from "@std/testing/bdd";
import { assert, assertStrictEquals as assertSame } from "@std/assert";

describe("HTTP routing", () => {
	it("generates a response for all routes", async () => {
		let res = await process("/");
		let html = await res.text();
		assertSame(res.status, 200);
		assert(html.startsWith("<!DOCTYPE html>\n"));
		assert(html.includes('<link rel="stylesheet" href="/assets/main.css">'));

		res = await process("/assets");
		assertSame(res.status, 404);

		res = await process("/assets/main.css");
		assertSame(res.status, 200);
		assert((await res.text()).includes(":root {\n"));

		res = await process("/" + crypto.randomUUID());
		assertSame(res.status, 404);
	});
});

/**
 * @param {string} uri
 * @returns {Response | Promise<Response>}
 */
function process(uri) {
	let req = new Request("https://example.org" + uri);
	return dispatch(ROUTES, req);
}
