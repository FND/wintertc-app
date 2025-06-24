import { ROUTES } from "./config.js";
import { dispatch } from "../lib/http/index.js";
import { serve } from "../lib/adaptor.js";

/** @type {Route[]} */
let routes = [...ROUTES.values()];
serve(8000, dispatch.bind(null, routes));

/** @import { Route } from "../lib/route.js" */
