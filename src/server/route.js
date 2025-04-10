export class Route {
	/**
	 * @param {string} name
	 * @param {string} pattern
	 * @param {Record<string, RequestHandler>} handlers
	 */
	constructor(name, pattern, handlers) {
		this.name = name;
		this._pattern = new URLPattern({ pathname: pattern });
		this._handlers = handlers;
	}

	/**
	 * @param {Request} req
	 * @returns {Result}
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
}

/**
 * @typedef {(req: Request, params: PathParams) => Result} RequestHandler
 * @typedef {Record<string, string | undefined>} PathParams
 * @typedef {Response | Promise<Response> | null} Result
 */
