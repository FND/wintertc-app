import { ROUTES } from "./config.js";
import { dispatch } from "./http/index.js";
import { serve } from "./adaptor.js";

/** @type {Route[]} */
let routes = [...ROUTES.values()];
serve(8000, dispatch.bind(null, routes));

/** @import { Route } from "./route.js" */
