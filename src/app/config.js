import rootHandlers from "./routes/root.js";
import * as articleHandlers from "./routes/articles.js";
import assetHandlers from "./routes/assets.js";
import { Route } from "../lib/route.js";

let ROUTES_LIST = [
	new Route("root", "/", rootHandlers),
	new Route("asset", "/assets/:filename", assetHandlers),
	new Route("articles", "/articles", articleHandlers.collection),
	new Route("article", "/articles/:slug", articleHandlers.entity),
];

/** @type {Map<string, Route>} */
export let ROUTES = new Map();
for (let route of ROUTES_LIST) {
	ROUTES.set(route.name, route);
}
