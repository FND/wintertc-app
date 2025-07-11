import { createServer } from "node:http";
import { open, realpath as nRealPath, stat as nstat } from "node:fs/promises";
import { extname } from "node:path";

let MIME_TYPES = new Map([ // XXX: insufficient
	["css", "text/css"],
	["js", "text/javascript"],
]);

export class NotFoundError extends Error {}

/**
 * @param {number} port
 * @param {(req: Request) => Response | Promise<Response>} handler
 * @returns {undefined}
 */
export function serve(port, handler) {
	let server = createServer(node2web.bind(null, handler)).listen(port);
	let host = server.address();
	console.error(`→ http://${host.address}:${host.port}`);
}

/**
 * @param {string} filepath
 * @returns {string | undefined}
 */
export function contentType(filepath) {
	let type = extname(filepath).slice(1);
	return MIME_TYPES.get(type);
}

/**
 * @param {string} filepath
 * @returns {Promise<ReadableStream<Uint8Array<ArrayBuffer>>>}
 */
export async function readableStream(filepath) {
	try {
		let fh = await open(filepath);
		return fh.readableWebStream();
	} catch (err) {
		if (err.code === "ENOENT") {
			throw new NotFoundError(`file not found: \`${filepath}\``);
		}
		throw err;
	}
}

/**
 * @param {string} filepath
 * @returns {Promise<{ size: number, isFile: boolean }>}
 */
export async function stat(filepath) {
	let file = await nstat(filepath);
	return {
		size: file.size,
		isFile: file.isFile(),
	};
}

/**
 * @param {string} filepath
 * @returns {Promise<string>}
 */
export function realpath(filepath) {
	try {
		return nRealPath(filepath);
	} catch (err) {
		if (err.code === "ENOENT") {
			throw new NotFoundError(`file not found: \`${filepath}\``);
		}
		throw err;
	}
}

/**
 * @param {(nreq: Request) => Response | Promise<Response>} handler
 * @param {ClientRequest} nreq
 * @param {ServerResponse} nres
 */
async function node2web(handler, nreq, nres) {
	let { method } = nreq;
	let withBody = method !== "GET" && method !== "HEAD"; // XXX: crude
	let wreq = new Request("http://localhost" + nreq.url, { // XXX: `localhost` is hacky
		method,
		headers: nreq.headers,
		body: withBody ? ReadableStream.from(nreq) : null,
		duplex: "half",
	});
	let wres = await handler(wreq);

	let headers = Object.fromEntries(wres.headers.entries()); // XXX: lossy
	nres.writeHead(wres.status, headers);

	let { body } = wres;
	if (body) {
		for await (let chunk of body) {
			nres.write(chunk);
		}
	}
	nres.end();
}

/** @import { ClientRequest, ServerResponse } from "node:http" */
