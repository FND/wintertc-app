import { Route } from "./route.js";
import { describe, it } from "@std/testing/bdd";
import { assertStrictEquals as assertSame } from "@std/assert";

describe("URL-based routing", () => {
	it("invokes matching request handler, if any", async () => {
		let invocations = 0;
		/** @type {Request | null} */
		let latestRequest = null;
		let route = new Route("asset", "/assets/:filename", {
			/**
			 * @param {Request} req
			 * @param {PathParams} params
			 * @returns {Response}
			 */
			GET: (req, { filename }) => {
				invocations++;
				latestRequest = req;
				return makeResponse(`${filename}\n\nlorem ipsum\n`);
			},
		});

		for (let uri of ["/dummy", "/assets", "/assets/", "/assets/foo/bar"]) {
			let req = makeRequest("GET", uri);
			let ctx = `\`${uri}\``;
			assertSame(route.dispatch(req), null, ctx);
			assertSame(invocations, 0, ctx);
		}

		let req = makeRequest("GET", "/assets/lipsum.txt");
		let res = await route.dispatch(req);
		assertSame(res?.status, 200);
		assertSame(await res?.text(), "lipsum.txt\n\nlorem ipsum\n");
		assertSame(invocations, 1);
		assertSame(latestRequest, req);

		let alt = makeRequest("POST", "/assets/lipsum.txt");
		res = await route.dispatch(alt);
		assertSame(res?.status, 405);
		assertSame(await res?.text(), "405 Method Not Allowed\n");
		assertSame(invocations, 1);
		assertSame(latestRequest, req);
	});

	it("supports reverse routing", () => {
		let route = new Route("asset", "/assets/:filename", {});
		/** @type {URL} */
		let url = route.url({ filename: "lipsum.txt" });
		assertSame(url.toString(), "/assets/lipsum.txt");

		let req = { url: "https://example.org/foo/bar" };
		url = route.url(req, { filename: "lipsum.txt" });
		assertSame(url.toString(), "https://example.org/assets/lipsum.txt");
	});

	it("supports sanitizing non-trivial URL patterns for reverse routing", () => {
		let route = new Route("asset", "/assets/:filepath(.+)", {});
		/** @type {URL} */
		let url = route.url({ filepath: "lipsum.txt" });
		assertSame(url.toString(), "/assets/lipsum.txt(.+)");

		let req = { url: "https://example.org/foo/bar" };
		url = route.url(req, { filepath: "lipsum.txt" });
		assertSame(url.toString(), "https://example.org/assets/lipsum.txt(.+)");

		route = new Route("asset", "/assets/:filepath(.+)", {}, (url) => {
			url.pathname = url.pathname.replace("(.+)", "");
			return url;
		});
		url = route.url({ filepath: "lipsum.txt" });
		assertSame(url.toString(), "/assets/lipsum.txt");

		req = { url: "https://example.org/foo/bar" };
		url = route.url(req, { filepath: "lipsum.txt" });
		assertSame(url.toString(), "https://example.org/assets/lipsum.txt");
	});
});

/**
 * @param {string} body
 * @returns {Response}
 */
function makeResponse(body) {
	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

/**
 * @param {string} method
 * @param {string} uri
 * @returns {Request}
 */
function makeRequest(method, uri) {
	return new Request("https://example.org" + uri, { method });
}

/** @import { PathParams } from "./route.js" */
