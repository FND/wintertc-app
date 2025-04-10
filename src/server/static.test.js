import { serveStatic } from "./static.js";
import { describe, it } from "@std/testing/bdd";
import { assertStrictEquals as assertSame } from "@std/assert";

let FIXTURES_DIR = new URL("../../test/fixtures", import.meta.url).pathname;

describe("static assets", () => {
	it("generates a response for files on disk", async () => {
		let res = await serveStatic("lipsum.txt", FIXTURES_DIR);
		assertSame(res.status, 200);
		assertSame(await res.text(), "lorem ipsum\ndolor sit amet\n");
	});

	it("balks at missing files", async () => {
		let res = await serveStatic("dummy.txt");
		assertSame(res.status, 404);
	});

	it("balks at directories", async () => {
		let res = await serveStatic("./");
		assertSame(res.status, 404);
	});

	it("balks at files outside the respective directory", async () => {
		let res = await serveStatic("../dummy.txt");
		assertSame(res.status, 404);

		res = await serveStatic("../../README.md");
		assertSame(res.status, 404);
	});
});
