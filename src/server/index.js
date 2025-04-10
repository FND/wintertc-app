import { serve } from "./adaptor.js";

/**
 * @param {Request} req
 * @returns {Response | Promise<Response>}
 */
function handleRequest(req) {
	return new Response(`hello world from ${req.url}`, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

serve(8000, handleRequest);
