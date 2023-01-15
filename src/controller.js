import * as readUserModel from "./model/readUserModel.js";
import * as newsModel from "./model/newsModel.js";

export const error404 = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("error404.html", {
    user: { username: ctx.user },
  });
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};
