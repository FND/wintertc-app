/**
 * @param {Request["body"]} body
 * @returns {Promise<URLSearchParams>}
 */
export async function formData(body) {
	if (!body) {
		return new URLSearchParams();
	}

	let res = [];
	let decoder = new TextDecoder();
	for await (let chunk of body) {
		res.push(decoder.decode(chunk));
	}
	return new URLSearchParams(res.join(""));
}

/**
 * @param {string} str
 * @param {boolean} isAttribute
 * @returns {string}
 */
export function encodeHTML(str, isAttribute = false) {
	str = str.replaceAll("&", "&amp;");
	if (isAttribute) {
		return str.replaceAll('"', "&quot;")
			.replaceAll("'", "&#x27;");
	}
	return str.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}
