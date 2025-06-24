import { dispatch, http302 } from "./index.js";
import { Route } from "../route.js";
import { describe, it } from "@std/testing/bdd";
import { assertStrictEquals as assertSame } from "@std/assert";

/** @type {Route[]} */
let ROUTES = [
	new Route("root", "/", {
		GET: () => new Response("<!DOCTYPE html>\n<p>lipsum</p>"),
		POST: () => http302("/"),
	}),
	new Route("asset", "/assets/:filename", {
		GET: () => new Response(":root {}\n"),
	}),
];

describe("HTTP routing", () => {
	it("generates a response for all routes", async () => {
		let res = await process("/");
		assertSame(res.status, 200);
		assertSame(await res.text(), "<!DOCTYPE html>\n<p>lipsum</p>");

		res = await process("/", { method: "POST" });
		assertSame(res.status, 302);
		assertSame(res.headers.get("Location"), "/");

		res = await process("/assets");
		assertSame(res.status, 404);

		res = await process("/assets/main.css");
		assertSame(res.status, 200);
		assertSame(await res.text(), ":root {}\n");

		res = await process("/dummy");
		assertSame(res.status, 404);
	});
});

/**
 * @param {string} uri
 * @param {RequestInit} [options]
 * @returns {Response | Promise<Response>}
 */
function process(uri, options) {
	let req = new Request("https://example.org" + uri, options);
	return dispatch(ROUTES, req);
}
