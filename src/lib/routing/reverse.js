export class ReverseRouter {
	/** @type {Map<string, Route>} */
	_routes = new Map();
	/** @type {Map<string, Route["url"]>} */
	_cache = new Map();

	/** @param {Iterable<Route>} routes */
	constructor(routes) {
		for (let route of routes) {
			this._routes.set(route.name, route);
		}
	}

	/**
	 * @param {string} name
	 * @returns {Route["url"]}
	 */
	get(name) {
		let cache = this._cache;
		let url = cache.get(name);
		if (url) {
			return url;
		}

		let route = this._routes.get(name);
		if (!route) {
			throw new Error(`unknown route \`${name}\``);
		}

		url = route.url.bind(route);
		cache.set(name, url);
		return url;
	}

	*[Symbol.iterator]() {
		yield* this._routes.values();
	}
}

/** @import { Route } from "./route.js" */
