import { Hono } from 'hono';
import { HTTPException } from "hono/http-exception";
import { DB } from "./db.ts";
import type { Data } from "./db.ts";
import { appendTrailingSlash } from 'hono/trailing-slash';

const app: Hono = new Hono();

app
  .use(appendTrailingSlash())
  .get('/', (c) => {
    return c.body(Deno.readFileSync(import.meta.dirname + "/src/index.html"))
  })

  .get('/script.js', c => c.body(Deno.readFileSync(import.meta.dirname + "/src/script.js")))
  .get('/style.css', c => c.body(Deno.readFileSync(import.meta.dirname + "/src/style.css")))
  .post('/', async c => {
    const contentType = c.req.header('Content-Type') ?? 'text/html';
    if (contentType == "application/json") {
      const data: Data = await c.req.json();
      if (typeof data === 'object' && Object.hasOwn(data, 'to') && typeof data.to === 'string' && data.to != "" && isValidURL(data.to)) {
        const res = await new DB().createLink(data.to, data.from ?? null);
        if (res.success)
          return c.json({ ok: true, data: res.result });
      }
    }
    throw new HTTPException(400, { res: c.json({ message: '🥲' }), })
  })
  .get('/:id/', async (c) => {
    const contentType = c.req.header('Content-Type') ?? 'text/html';
    const id = c.req.param("id");
    const res = await new DB().getLink(id);
    if (res) {
      if (contentType == "application/json")
        return c.json(res ?? {});
      return c.redirect(res.to);
    }
    throw new HTTPException(400, { res: c.html(Deno.readTextFileSync(import.meta.dirname + "/src/error.html")), message: '🥲' })
  })
  //.use("*", async (c, next) => {
  //  console.log(c.req.path);
  //  console.log(c.req.url);
  //  await next();
  //})

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
