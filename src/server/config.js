import rootHandlers from "./routes/root.js";
import * as articleHandlers from "./routes/articles.js";
import assetHandlers from "./routes/assets.js";
import { Route } from "./route.js";

export let ROUTES = [
	new Route("root", "/", rootHandlers),
	new Route("asset", "/assets/:filename", assetHandlers),
	new Route("articles", "/articles", articleHandlers.collection),
	new Route("article", "/articles/:slug", articleHandlers.entity),
];
