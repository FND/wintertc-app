import { LocalURL } from "./http/url.js";

export class Route {
	/**
	 * @param {string} name
	 * @param {string} pattern
	 * @param {Record<string, RequestHandler>} handlers
	 * @param {URLSanitizer} [urlizer]
	 */
	constructor(name, pattern, handlers, urlizer) {
		this.name = name;
		this._rawPattern = pattern;
		this._pattern = new URLPattern({ pathname: pattern });
		this._handlers = handlers;
		this._urlizer = urlizer;
	}

	/**
	 * @param {Request} req
	 * @returns {HTTPResponse | null}
	 */
	dispatch(req) {
		let match = this._pattern.exec(req.url);
		if (!match) {
			return null;
		}

		let handler = this._handlers[req.method];
		if (handler) {
			return handler(req, match.pathname.groups);
		}

		return new Response("405 Method Not Allowed\n", {
			status: 405,
			headers: {
				Allow: Object.keys(this._handlers).join(", "),
				"Content-Type": "text/plain",
			},
		});
	}

	/**
	 * generates a host-relative URL for this route
	 * @overload
	 * @param {PathParams} [pathParams]
	 * @returns {LocalURL}
	 */
	/**
	 * generates a fully qualified URL for this route
	 * @overload
	 * @param {Pick<Request, "url">} req
	 * @param {PathParams} [pathParams]
	 * @returns {URL}
	 */
	/**
	 * @param {Pick<Request, "url"> | PathParams} [req]
	 * @param {PathParams} [pathParams]
	 * @returns {URL | LocalURL}
	 */
	url(req, pathParams) {
		if (pathParams === undefined && !(req && "url" in req)) { // alternative signature
			pathParams = req;
			req = undefined;
		}

		let url = this._rawPattern;
		if (pathParams) {
			for (const [name, value] of Object.entries(pathParams)) {
				// XXX: crude and not type-safe; eventually to be replaced with
				//      https://github.com/whatwg/urlpattern/issues/73
				url = url.replace(`:${name}`, value ?? "");
			}
		}
		const res = req ? new URL(url, req.url) : new LocalURL(url);
		return this._urlizer?.(res) ?? res;
	}
}

/**
 * @typedef {(req: Request, params: PathParams) => HTTPResponse} RequestHandler
 * @typedef {(url: URL) => URL} URLSanitizer
 * @typedef {Record<string, string | undefined>} PathParams
 * @typedef {Response | Promise<Response>} HTTPResponse
 */
