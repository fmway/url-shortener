import { Hono } from "hono";
import defaultApp from "./index.ts";

export default defaultApp;
export function nestingRequest(inPath: string): Hono {
  const app: Hono = new Hono({
    getPath: req => {
      const res = req.url.replace(/^(http(s?))?(:\/\/)?[^\/]+(\/[^?]+).*$/, '$4').replace(/\/+$/, '')
      console.log(res);
      return res;
    },
  }).basePath(inPath);
  app.route("/", defaultApp);
  return app;
}
