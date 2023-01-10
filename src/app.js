//import notes from "../data/notes.json" assert { type: "json" };
import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as mediaTypes from "https://deno.land/std@0.151.0/media_types/mod.ts";
import userMiddleware from "./utils/userMiddleware.js";
import serveStaticFile from "./utils/serveStaticFile.js";

import * as controller from "./controller.js";
import * as formController from "./form-controller.js";

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
  userMiddleware(ctx);

  const base = "assets";
  ctx = await serveStaticFile(base, ctx);

  let result = await router(ctx);

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

const router = async (ctx) => {
  if (ctx.response.status === 200) return ctx;
  const url = new URL(ctx.request.url);
  if (url.pathname == "/") return await controller.index(ctx);
  if (url.pathname == "/functionality")
    return await controller.functionality(ctx);
  if (url.pathname == "/governance") return await controller.governance(ctx);
  if (url.pathname == "/about") return await controller.about(ctx);
  if (url.pathname == "/createaccount") {
    const method = ctx.request.method;
    if (method == "GET") return await controller.createAccount(ctx);
    if (method == "POST") return await formController.submitCreateAccount(ctx);
  }
  if (url.pathname == "/login") {
    const method = ctx.request.method;
    if (method == "GET") return await controller.login(ctx);
    if (method == "POST") return await formController.submitLogin(ctx);
  }

  return await controller.error404(ctx);
};
