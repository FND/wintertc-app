import { ROUTER } from "./config.js";
import { dispatch } from "../lib/routing/index.js";
import { describe, it } from "@std/testing/bdd";
import { assert, assertStrictEquals as assertSame } from "@std/assert";

/** @type {Route[]} */
let ROUTES_LIST = [...ROUTER];

describe("HTTP routing", () => {
	it("generates a response for all routes", async () => {
		let res = await process("/");
		let html = await res.text();
		assertSame(res.status, 200);
		assert(html.startsWith("<!DOCTYPE html>\n"));
		assert(html.includes('<link rel="stylesheet" href="/assets/main.css">'));
		assert(html.includes('<form method="post" action="/">'));

		res = await process("/", { method: "POST" });
		assertSame(res.status, 302);
		assertSame(res.headers.get("Location"), "/");

		res = await process("/articles");
		assertSame(res.status, 200);
		assert((await res.text()).startsWith("hello-world: Hello World\n"));

		res = await process("/articles/hello-world");
		assertSame(res.status, 200);
		assert((await res.text()).startsWith("Hello World\n"));

		res = await process("/notifications");
		assertSame(res.status, 200);
		let txt = "";
		for await (let chunk of /** @type {any} */ (res.body)) {
			txt += new TextDecoder().decode(chunk);
			break;
		}
		assert(txt.startsWith("data: "));
		assert(txt.includes("\r\n\r\n"));

		res = await process("/assets");
		assertSame(res.status, 404);

		res = await process("/assets/main.css");
		assertSame(res.status, 200);
		assert((await res.text()).includes(":root {\n"));
	});
});

/**
 * @param {string} uri
 * @param {RequestInit} [options]
 * @returns {Response | Promise<Response>}
 */
function process(uri, options) {
	let req = new Request("https://example.org" + uri, options);
	return dispatch(ROUTES_LIST, req);
}

/** @import { Route } from "../lib/routing/route.js" */
