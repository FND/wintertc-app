import { NotFoundError as _NotFoundError } from "./common.js";

let DENO = globalThis.Deno;
let _deno, _node;
if (DENO) {
	_deno = await import("./deno.js");
} else {
	_node = await import("./node.js");
}
let RUNTIME = /** @type {NonNullable<typeof _node>} */ (_deno ?? _node);

export let NotFoundError = DENO?.errors.NotFound ?? _NotFoundError;

/**
 * @param {number} port
 * @param {(req: Request) => Response | Promise<Response>} handler
 * @returns {void}
 */
export function serve(port, handler) {
	if (DENO) {
		DENO.serve({ port }, handler);
	} else {
		RUNTIME.serve(port, handler);
	}
}

/**
 * @param {string} filepath
 * @returns {string | undefined}
 */
export function contentType(filepath) {
	return RUNTIME.contentType(filepath);
}

/**
 * @param {string} filepath
 * @returns {Promise<ReadableStream<Uint8Array<ArrayBuffer>> | FileBuffer>}
 */
export async function readFile(filepath) {
	if (DENO) {
		let fh = await DENO.open(filepath);
		return fh.readable;
	}

	// XXX: while Node does support `.readableWebStream()` on files, it requires
	//      explicitly invoking `.close()` after consuming the stream, thus
	//      rendering it unsuitable for response streaming elsewhere
	return RUNTIME.readFile(filepath);
}

/**
 * @param {string} filepath
 * @returns {Promise<{ size: number, isFile: boolean }>}
 */
export async function stat(filepath) {
	if (DENO) {
		let { size, isFile } = await DENO.stat(filepath);
		return { size, isFile };
	}

	return RUNTIME.stat(filepath);
}

/**
 * @param {string} filepath
 * @returns {Promise<string>}
 */
export function realpath(filepath) {
	if (DENO) {
		return DENO.realPath(filepath);
	}

	return RUNTIME.realpath(filepath);
}

/** @import { FileBuffer } from "./node.js" */
