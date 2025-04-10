/**
 * @param {number} port
 * @param {(req: Request) => Response | Promise<Response>} handler
 * @returns {undefined}
 */
export function serve(port, handler) {
	Deno.serve({ port }, handler);
}
