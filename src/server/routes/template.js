import { html } from "../html.js";

/**
 * @param {{ title: string, lang?: string }} meta
 * @param {TrustedContent} header
 * @param {TrustedContent} body
 * @returns {TrustedContent}
 */
export function document({ lang, title }, header, body) {
	return html`
<!DOCTYPE html>
<html${{ lang }}>

<head>
	<meta charset="utf-8">
	<title>${title}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	${header}
</head>

<body>${body}</body>

</html>
	`;
}

/** @import { TrustedContent } from "../html.js" */
