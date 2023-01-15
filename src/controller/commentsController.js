import * as readUserModel from "../model/readUserModel.js";
import * as newsModel from "../model/newsModel.js";
import * as commentsModel from "../model/commentsModel.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const upvoteComment = async (ctx, commentId) => {
  const url = new URL(ctx.request.headers.get("referer"));
  const user = await readUserModel.getUser(ctx.db, ctx.user);

  user && (await commentsModel.upvoteComment(ctx, commentId));
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: user ? url.pathname : "/login" },
  });
  return ctx;
};

export const downvoteComment = async (ctx, commentId) => {
  const url = new URL(ctx.request.headers.get("referer"));
  const user = await readUserModel.getUser(ctx.db, ctx.user);

  user && (await commentsModel.downvoteComment(ctx, commentId));
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: user ? url.pathname : "/login" },
  });
  return ctx;
};

export const deletecomment = async (ctx, commentId) => {
  const url = new URL(ctx.request.headers.get("referer"));

  await commentsModel.deleteComment(ctx, commentId);
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: url.pathname },
  });
  return ctx;
};

export const comment = async (ctx, newsId) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  const formdata = await ctx.request.formData();
  const comment = formdata.get("comment");
  user &&
    (await commentsModel.comment(ctx, newsId, comment, user.profilePicture));
  ctx.redirect = new Response(null, {
    status: 302,
    headers: { Location: user ? "/news/" + newsId : "/login" },
  });
  return ctx;
};
