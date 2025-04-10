import { handleRequest } from "./http.js";
import { serve } from "./adaptor.js";

serve(8000, handleRequest);
