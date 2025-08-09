import { NotFoundError } from "./common.js";
import { createServer } from "node:http";
import {
	readFile as nReadFile,
	realpath as nRealPath,
	stat as nStat,
} from "node:fs/promises";
import { extname } from "node:path";

let MIME_TYPES = new Map([ // XXX: insufficient
	["css", "text/css"],
	["js", "text/javascript"],
]);

/**
 * @param {number} port
 * @param {(req: Request) => Response | Promise<Response>} handler
 * @returns {undefined}
 */
export function serve(port, handler) {
	// @ts-expect-error TODO
	let server = createServer(node2web.bind(null, handler)).listen(port);
	let host = server.address();
	// @ts-expect-error TS18047, TS2339
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
 * @returns {Promise<FileBuffer>}
 */
export async function readFile(filepath) {
	try {
		return await nReadFile(filepath);
	} catch (err) { // @ts-expect-error TS18046
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
	try { // deno-lint-ignore no-var no-inner-declarations
		var file = await nStat(filepath);
	} catch (err) {
		noSuchFile(/** @type {any} */ (err), filepath);
		throw err;
	}

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
		noSuchFile(/** @type {any} */ (err), filepath);
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
	// @ts-expect-error TS2339
	let wreq = new Request("http://localhost" + nreq.url, { // XXX: `localhost` is hacky
		method,
		// @ts-expect-error TS2339
		headers: nreq.headers,
		// @ts-expect-error TS2345
		body: withBody ? ReadableStream.from(nreq) : null,
		// @ts-expect-error TS2353
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

/**
 * @param {Error & { code: string }} err
 * @param {string} filepath
 */
function noSuchFile(err, filepath) {
	if (err.code === "ENOENT") {
		throw new NotFoundError(`file not found: \`${filepath}\``);
	}
}

/**
 * @typedef {Buffer<ArrayBufferLike>} FileBuffer
 * @import { ClientRequest, ServerResponse } from "node:http"
 * @import { Buffer } from "node:buffer"
 */
