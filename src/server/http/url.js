let TRUE = crypto.randomUUID();

export class LocalURL extends URL {
	/** @param {URL | string} url */
	constructor(url) {
		super(url, "http://localhost");
		super.searchParams.set = setParam; // adds support for boolean parameters
	}

	/**
	 * @override
	 * @returns {URLSearchParams & { set: setParam }}
	 */
	get searchParams() { // XXX: required only to appease TypeScript
		// @ts-ignore TS2322 - see monkey-patching in constructor
		return super.searchParams;
	}

	/** @override */
	toString() {
		return super.toString()
			.slice(this.origin.length)
			.replaceAll(`=${TRUE}`, "");
	}
}

/**
 * @this {URLSearchParams}
 * @param {string} name
 * @param {string | boolean} value
 */
function setParam(name, value) {
	if (value === false) {
		return;
	}

	return URLSearchParams.prototype.set.call(this, name, value === true ? TRUE : value);
}
