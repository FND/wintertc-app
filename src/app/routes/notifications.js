let INTERVAL = 2000;
let LIPSUM = `
lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute
irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui
officia deserunt mollit anim id est laborum
`.trim().split(/\s/);

let CRLF = "\r\n";

export default {
	GET: stream,
};

/** @returns {Response} */
function stream() {
	/** @type {number} */
	let interval;
	let body = new ReadableStream({
		start(controller) {
			let encoder = new TextEncoder();
			let emit = () => {
				let msg = encoder.encode("data: " + randomMessage() + CRLF + CRLF);
				controller.enqueue(msg);
			};

			emit();
			interval = setInterval(emit, INTERVAL);
		},
		cancel() {
			clearInterval(interval);
		},
	});
	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
		},
	});
}

function randomMessage() {
	let max = LIPSUM.length - 1;
	let txt = "";
	for (let i = 0; i < randomInt(2, 5); i++) {
		txt += (i === 0 ? "" : " ") + LIPSUM[randomInt(0, max)];
	}
	return txt;
}

/**
 * returns a random integer within the given bounds (both inclusive)
 * @param {number} min
 * @param {number} max
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
