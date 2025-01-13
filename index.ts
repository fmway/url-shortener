import { Hono } from 'hono';
import { HTTPException } from "hono/http-exception";
import { DB } from "./db.ts";
import type { Data } from "./db.ts";

const app: Hono = new Hono();

app
  .get('/', (c) => {
    const contentType = c.req.header('Content-Type') ?? 'text/html';
    if (contentType === "application/json" && c.req.query("random") !== undefined)
      return c.json(new DB().randomId());
    
    c.header('Content-Type', 'text/html');
    return c.body(Deno.readFileSync(import.meta.dirname + "/src/index.html"));
  })

  .get('/script.js', c => {
    c.header('Content-Type', 'text/javascript')
    return c.body(Deno.readFileSync(import.meta.dirname + "/src/script.js"));
  })
  .get('/style.css', c => {
    c.header('Content-Type', 'text/css')
    return c.body(Deno.readFileSync(import.meta.dirname + "/src/style.css"));
  })
  .post('/', async c => {
    const contentType = c.req.header('Content-Type') ?? 'text/html';
    if (contentType == "application/json") {
      const data: Data = await c.req.json();
      //if (typeof data === 'object' && Object.hasOwn(data, 'to') && typeof data.to === 'string' && data.to != "" && isValidURL(data.to)) {
        const res = await new DB().createLink(data.to, data.from);
        if (res.success)
          return c.json({ ok: true, data: res.result });
      //}
    }
    throw new HTTPException(400, { res: c.json({ message: '🥲' }), })
  })
  .get('/:id/:key?', async (c) => {
    const contentType = c.req.header('Content-Type') ?? 'text/html';
    const { id, key } = c.req.param();
    const res = await new DB().getLink(id);
    if (res) {
      if (contentType == "application/json")
        return c.json(res ?? {});
      if (typeof res.to === "string" && !key)
        return c.redirect(res.to)
      else if (Array.isArray(res.to)) {
        if (!key)
          return c.redirect(res.to[0])
        const k = parseInt(key);
        if (!isNaN(k) && res.to[k])
          return c.redirect(res.to[k])
      } else if (typeof res.to !== "string") {
        if (key && Object.hasOwn(res.to, key))
          return c.redirect(res.to[key]);
        return c.redirect(res.to[Object.keys(res.to)[0]])
      }
    }
    throw new HTTPException(400, { res: c.html(Deno.readTextFileSync(import.meta.dirname + "/src/error.html")), message: '🥲' })
  })

function isValidURL(url: string): boolean {
  try {
    const tmpUrl = new URL(url);
    if (!["http:", "https:"].includes(tmpUrl.protocol))
      throw new Error('');
    return true;
  } catch (_) {
    return false;
  }
}

export default app;
