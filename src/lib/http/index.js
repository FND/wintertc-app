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
