import { contentType, NotFoundError, readFile, realpath, stat } from "./adaptor/index.js";

/**
 * @param {string} filepath
 * @param {string} rootDir
 * @returns {Promise<Response>}
 */
export async function serveStatic(filepath, rootDir) {
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
 * @returns {Promise<{ body: ReadableStream<Uint8Array> | string } | Record<string, string>>}
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

	let stream = await readFile(filepath);
	let mimeType = contentType(filepath);
	/** @type {ReadableStream<Uint8Array> | string} */
	let body; // XXX: leaky abstraction; heuristics below required due to Node support
	if (stream instanceof ReadableStream) {
		body = stream;
	} else if (mimeType === undefined) { // XXX: brittle
		body = /** @type {any} */ (stream);
	} else {
		body = stream.toString();
	}

	return {
		body,
		"Content-Type": mimeType ?? "application/octet-stream",
		"Content-Length": size.toString(),
	};
}
