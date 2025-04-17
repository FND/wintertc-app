import { http404 } from "../http/index.js";
import {
	contentType,
	NotFoundError,
	readableStream,
	realpath,
	stat,
} from "../adaptor.js";

let ASSETS_DIR = new URL("../../client", import.meta.url).pathname;

export default {
	/**
	 * @param {Request} _req
	 * @param {PathParams} params
	 * @returns {Promise<Response> | Response}
	 */
	GET: (_req, { filename }) => filename ? _serveStatic(filename) : http404(),
};

/**
 * @param {string} filepath
 * @param {string} rootDir
 * @returns {Promise<Response>}
 */
export async function _serveStatic(filepath, rootDir = ASSETS_DIR) {
	try {
		let { body, ...headers } = await read(filepath, rootDir);
		return new Response(body, { headers });
	} catch (err) {
		let status = 404;
		if (!(err instanceof NotFoundError)) {
			status = 500;
			console.error(err);
		}
		return new Response(null, { status });
	}
}

/**
 * @param {string} filepath
 * @param {string} rootDir
 * @returns {Promise<{ body: ReadableStream<Uint8Array> } | Record<string, string>>}
 */
async function read(filepath, rootDir) {
	filepath = await realpath(rootDir + "/" + filepath); // TODO: normalize `rootDir`?
	if (!filepath.startsWith(rootDir)) { // XXX: insufficient?
		console.error(`restricted access to \`${filepath}\``);
		throw new NotFoundError("invalid file reference");
	}

	let { size, isFile } = await stat(filepath);
	if (!isFile) {
		console.error(`restricted access to directory \`${filepath}\``);
		throw new NotFoundError("invalid file reference");
	}

	return {
		body: await readableStream(filepath),
		"Content-Type": contentType(filepath) ?? "application/octet-stream",
		"Content-Length": size.toString(),
	};
}

/** @import { PathParams } from "../route.js" */
