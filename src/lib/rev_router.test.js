import { ReverseRouter } from "./rev_router.js";
import { Route } from "./route.js";
import { LocalURL } from "./http/url.js";
import { describe, it } from "@std/testing/bdd";
import { assert, assertStrictEquals as assertSame, assertThrows } from "@std/assert";

let ROUTER = new ReverseRouter([
	new Route("root", "/", {
		GET: () => new Response(null),
	}),
	new Route("asset", "/assets/:filename", {
		GET: () => new Response(null),
	}),
]);

describe("routing", () => {
	it("exposes routes in order", () => {
		let routes = [...ROUTER];
		assertSame(routes.length, 2);
		assertSame(routes[0].name, "root");
		assertSame(routes[1].name, "asset");
	});
});

describe("reverse routing", () => {
	it("provides access to the respective URL generator", () => {
		let url = ROUTER.get("root")();
		assert(url instanceof LocalURL);
		assertSame(url.toString(), "/");

		let uri = ROUTER.get("asset");
		assertSame(uri({ filename: "lipsum.txt" }).toString(), "/assets/lipsum.txt");
	});

	it("balks at unknown routes", () => {
		assertThrows(() => ROUTER.get("dummy"), Error, "unknown route `dummy`");
	});
});
