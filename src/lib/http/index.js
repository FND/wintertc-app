/**
 * @param {string} url
 * @returns {Response}
 */
export function http302(url) {
	return new Response(null, {
		status: 302,
		headers: {
			Location: url,
		},
	});
}

/** @returns {Response} */
export function http404() {
	return new Response("404 Not Found\n", {
		status: 404,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

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
