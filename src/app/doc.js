import { html } from "../lib/html.js";

/**
 * @param {{ title: string, lang?: string }} meta
 * @param {TrustedContent} head
 * @param {TrustedContent} body
 * @returns {TrustedContent}
 */
export function document({ lang, title }, head, body) {
	// deno-fmt-ignore
	return html`
<!DOCTYPE html>
<html${{ lang }}>

<head>
	<meta charset="utf-8">
	<title>${title}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	${head}
</head>

<body>${body}</body>

</html>
	`;
}

/** @import { TrustedContent } from "../lib/html.js" */
