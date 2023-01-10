import * as model from "./model.js";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";

const debug = Debug("app:controller");

export function error404(ctx) {
  debug("@error404. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("error404.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function functionality(ctx) {
  debug("@about. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("functionality.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function governance(ctx) {
  debug("@about. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("governance.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function createAccount(ctx) {
  debug("@about. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("createAccount.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function login(ctx) {
  debug("@about. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("login.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function about(ctx) {
  debug("@about. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("about.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function index(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("index.html", {
    notes: ctx.data,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
