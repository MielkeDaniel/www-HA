import * as readUserModel from "../model/readUserModel.js";
import * as newsModel from "../model/newsModel.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const upvoteComment = async (ctx, commentId) => {
  const url = new URL(ctx.request.headers.get("referer"));
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  if (!user) {
    ctx.response.body = ctx.nunjucks.render("newsSubPage.html", {
      errors: { login: "You need to be logged in to upvote!" },
      user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    await newsModel.upvoteComment(ctx, commentId);
    ctx.redirect = new Response(null, {
      status: 303,
      headers: { Location: url.pathname },
    });
  }
};

export const downvoteComment = async (ctx, commentId) => {
  const url = new URL(ctx.request.headers.get("referer"));
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  if (!user) {
    ctx.response.body = ctx.nunjucks.render("newsSubPage.html", {
      errors: { login: "You need to be logged in to downvote!" },
      user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    await newsModel.downvoteComment(ctx, commentId);
    ctx.redirect = new Response(null, {
      status: 303,
      headers: { Location: url.pathname },
    });
  }
};

export const deletecomment = async (ctx, commentId) => {
  const url = new URL(ctx.request.headers.get("referer"));

  await newsModel.deleteComment(ctx, commentId);
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: url.pathname },
  });
};

export const comment = async (ctx, newsId) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  const formdata = await ctx.request.formData();
  const comment = formdata.get("comment");
  await newsModel.comment(ctx, newsId, comment, user.profilePicture);
  ctx.redirect = new Response(null, {
    status: 302,
    headers: { Location: "/news/" + newsId },
  });
  return ctx;
};
