import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./types/v3.js";
import authMiddlewareV3 from "./middleware/authMiddlewareV3.js";

const FLW_API_BASE = "https://api.flutterwave.com/";
const USER_AGENT = "flutterwave-mcp/0.1.0";
 
const client = createClient<paths>({ baseUrl: FLW_API_BASE, headers: { "User-Agent": USER_AGENT } });
client.use(authMiddlewareV3);

export default client