import { Middleware } from "openapi-fetch";

export const authMiddlewareV3: Middleware = {
    async onRequest({ request }) {
      request.headers.set("Authorization", "Bearer " + process.env.FLW_SECRET_KEY);
      return request;
    }
};

export default authMiddlewareV3;