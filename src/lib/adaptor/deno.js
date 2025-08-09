import { contentType as _contentType } from "jsr:@std/media-types/content-type";
import { extname } from "jsr:@std/path/extname";

/**
 * @param {string} filepath
 * @returns {string | undefined}
 */
export function contentType(filepath) {
	return _contentType(extname(filepath));
}
