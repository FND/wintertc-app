import { serveStatic } from "../../lib/assets.js";
import { http404 } from "../../lib/http/index.js";

let ASSETS_DIR = new URL("../../assets", import.meta.url).pathname;

export default {
	/**
	 * @param {Request} _req
	 * @param {PathParams} params
	 * @returns {Promise<Response> | Response}
	 */
	GET: (_req, { filename }) => filename ? serveStatic(filename, ASSETS_DIR) : http404(),
};

/** @import { PathParams } from "../../lib/route.js" */
