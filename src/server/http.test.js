import { handleRequest } from "./http.js";
import { describe, it } from "@std/testing/bdd";
import { assert, assertStrictEquals as assertSame } from "@std/assert";

let HOST = "https://example.org";

describe("HTTP routing", () => {
	it("generates a response for all routes", async () => {
		let res = await handleRequest({
			url: HOST + "/",
		});
		let html = await res.text();
		assertSame(res.status, 200);
		assert(html.startsWith("<!DOCTYPE html>\n"));
		assert(html.includes('<link rel="stylesheet" href="/assets/main.css">'));

		res = await handleRequest({
			url: HOST + "/assets",
		});
		assertSame(res.status, 404);

		res = await handleRequest({
			url: HOST + "/assets/main.css",
		});
		assertSame(res.status, 200);
		assert((await res.text()).includes(":root {\n"));

		res = await handleRequest({
			url: HOST + "/" + crypto.randomUUID(),
		});
		assertSame(res.status, 404);
	});
});
