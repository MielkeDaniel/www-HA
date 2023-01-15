//import notes from "../data/notes.json" assert { type: "json" };
import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";

import userMiddleware from "./utils/userMiddleware.js";
import serveStaticFile from "./utils/serveStaticFile.js";
import router from "./router/index.js";

import * as controller from "./controller.js";

// DEV only: noCache:true
nunjucks.configure("templates", { autoescape: true, noCache: true });

export const handleRequest = async (request) => {
  const db = new DB("data/database.sqlite");

  let ctx = {
    db: db,
    nunjucks: nunjucks,
    request: request,
    params: {},
    response: {
      body: undefined,
      status: undefined,
      headers: {},
    },
  };
  const base = "assets";
  ctx = await serveStaticFile(base, ctx);

  ctx = await userMiddleware(ctx);

  let result = await router.handle(ctx);

  // Handle redirect
  if (ctx.redirect) {
    return ctx.redirect;
  }

  // Fallback
  result.response.status = result.response.status ?? 404;
  if (!result.response.body && result.response.status == 404) {
    result = await controller.error404(result);
  }

  return new Response(result.response.body, {
    status: result.response.status,
    headers: result.response.headers,
  });
};
