import { Middleware } from "openapi-fetch";
import { RateLimiter } from "../../utils/rate-limiter.js";

const rateLimiter = new RateLimiter(10, 1000);

export const authMiddlewareV3: Middleware = {
    async onRequest({ request }) {
      await rateLimiter.throttle();
      request.headers.set("Authorization", "Bearer " + process.env.FLW_SECRET_KEY);
      return request;
    }
};

export default authMiddlewareV3;
