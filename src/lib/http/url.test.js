import { LocalURL } from "./url.js";
import { describe, it } from "@std/testing/bdd";
import { assertStrictEquals as assertSame } from "@std/assert";

describe("local URL", () => {
	it("supports boolean parameters", () => {
		let url = new LocalURL("https://example.org/search");
		url.searchParams.set("q", "lorem ipsum");
		url.searchParams.set("dummy", false);
		url.searchParams.set("case-sensitive", true);
		assertSame(url.toString(), "/search?q=lorem+ipsum&case-sensitive");
	});
});
