import { contentType as _contentType } from "jsr:@std/media-types/content-type";
import { extname } from "jsr:@std/path/extname";

export let NotFoundError = Deno.errors.NotFound;

/**
 * @param {number} port
 * @param {(req: Request) => Response | Promise<Response>} handler
 * @returns {undefined}
 */
export function serve(port, handler) {
	Deno.serve({ port }, handler);
}

/**
 * @param {string} filepath
 * @returns {string | undefined}
 */
export function contentType(filepath) {
	return _contentType(extname(filepath));
}

/**
 * @param {string} filepath
 * @returns {Promise<ReadableStream<Uint8Array<ArrayBuffer>>>}
 */
export async function readableStream(filepath) {
	let fh = await Deno.open(filepath);
	return fh.readable;
}

/**
 * @param {string} filepath
 * @returns {Promise<{ size: number, isFile: boolean }>}
 */
export async function stat(filepath) {
	let { size, isFile } = await Deno.stat(filepath);
	return { size, isFile };
}

/**
 * @param {string} filepath
 * @returns {Promise<string>}
 */
export function realpath(filepath) {
	return Deno.realPath(filepath);
}
