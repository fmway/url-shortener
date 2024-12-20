import { Hono } from "hono";
import defaultApp from "./index.ts";
export default defaultApp;
export function nestingRequest(inPath: string) {
  const app = new Hono();
  app.route(inPath, defaultApp);
  return app;
}
