/*
 * source: https://prepitaph.org/articles/lightweight-html-templating/
 */

let RAW = Symbol("raw HTML");

/**
 * @param {string} str
 * @returns {TrustedContent}
 */
export let trustedHTML = (str) => ({
	[RAW]: str,
	toString: () => str,
});

/**
 * @param {TemplateStringsArray} strings
 * @param {...(HTMLContent | Iterable<HTMLContent>)} values
 * @returns {TrustedContent}
 */
export function html(strings, ...values) {
	let i = 0;
	let res = [strings[i]];
	for (let value of values) {
		i++;
		if (typeof value === "number") {
			value = value.toString();
		}
		if (typeof value === "string") {
			res.push(encodeHTML(value));
		} else if (value === false || value === null || value === undefined) {
			// no-op
		} else if (RAW in value) {
			res.push(/** @type {TrustedContent} */ (value)[RAW]);
		} else if (/** @type {Iterable<HTMLContent>} */ (value)[Symbol.iterator]) {
			for (let entry of /** @type {Iterable<HTMLContent>} */ (value)) {
				// deno-fmt-ignore
				res.push(html`${entry}`[RAW]);
			}
		} else {
			res.push(serializeAttributes(/** @type {Attributes} */ (value)));
		}
		res.push(strings[i]);
	}
	return trustedHTML(res.join("").trim());
}

/** @param {Attributes} attribs */
function serializeAttributes(attribs) {
	let res = Object.entries(attribs).reduce((memo, [name, value]) => {
		if (typeof value === "number") {
			value = value.toString();
		}
		switch (value) {
			case false:
			case null:
			case undefined:
				return memo;
			case true:
				value = "";
				break;
		}
		return memo.concat(`${name}="${encodeHTML(value, true)}"`);
	}, /** @type {string[]} */ ([]));
	return res.length === 0 ? "" : [""].concat(res).join(" ");
}

/** @param {string} str */
function encodeHTML(str, isAttribute = false) {
	str = str.replaceAll("&", "&amp;");
	if (isAttribute) {
		return str.replaceAll('"', "&quot;")
			.replaceAll("'", "&#x27;");
	}
	return str.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

/**
 * @typedef {ScalarContent | false | TrustedContent | Attributes} HTMLContent
 * @typedef {Record<string, ScalarContent | boolean>} Attributes
 * @typedef {Record<typeof RAW, string> & { toString: () => string }} TrustedContent
 * @typedef {string | number | null | undefined} ScalarContent
 */
