import { ROUTER } from "./config.js";
import { dispatch } from "../lib/routing/index.js";
import { serve } from "../lib/adaptor.js";

serve(8000, dispatch.bind(null, [...ROUTER]));
