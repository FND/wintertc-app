import { ROUTES } from "./config.js";
import { dispatch } from "./http.js";
import { serve } from "./adaptor.js";

serve(8000, dispatch.bind(null, ROUTES));
