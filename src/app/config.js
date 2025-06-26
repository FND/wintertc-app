import rootHandlers from "./routes/root.js";
import * as articleHandlers from "./routes/articles.js";
import notificationHandlers from "./routes/notifications.js";
import assetHandlers from "./routes/assets.js";
import { ReverseRouter } from "../lib/rev_router.js";
import { Route } from "../lib/route.js";

export let ROUTER = new ReverseRouter([
	new Route("root", "/", rootHandlers),
	new Route("asset", "/assets/:filename", assetHandlers),
	new Route("articles", "/articles", articleHandlers.collection),
	new Route("article", "/articles/:slug", articleHandlers.entity),
	new Route("notifications", "/notifications", notificationHandlers),
]);
