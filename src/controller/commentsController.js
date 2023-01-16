import * as readUserModel from "../model/readUserModel.js";
import * as commentsModel from "../model/commentsModel.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const upvoteComment = async (ctx) => {
  const url = new URL(ctx.request.headers.get("referer"));

  ctx.user && (await commentsModel.upvoteComment(ctx, ctx.params.commentId));
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: ctx.user ? url.pathname : "/login" },
  });
  return ctx;
};

export const downvoteComment = async (ctx) => {
  const url = new URL(ctx.request.headers.get("referer"));

  ctx.user && (await commentsModel.downvoteComment(ctx, ctx.params.commentId));
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: ctx.user ? url.pathname : "/login" },
  });
  return ctx;
};

export const deletecomment = async (ctx) => {
  const url = new URL(ctx.request.headers.get("referer"));
  const comment = await commentsModel.getComment(ctx, ctx.params.commentId);

  if (comment.author === ctx.user.username || ctx.user.accountType == "admin") {
    await commentsModel.deleteComment(ctx, ctx.params.commentId);
    ctx.redirect = new Response(null, {
      status: 303,
      headers: { Location: url.pathname },
    });
    return ctx;
  } else {
    return ctx;
  }
};

export const comment = async (ctx) => {
  const formdata = await ctx.request.formData();
  const comment = formdata.get("comment");
  ctx.user &&
    (await commentsModel.comment(
      ctx,
      ctx.params.newsId,
      comment,
      ctx.user.profilePicture
    ));
  ctx.redirect = new Response(null, {
    status: 302,
    headers: { Location: ctx.user ? "/news/" + ctx.params.newsId : "/login" },
  });
  return ctx;
};

export const reply = async (ctx) => {
  const formdata = await ctx.request.formData();
  const reply = formdata.get("reply");
  ctx.user &&
    (await commentsModel.reply(
      ctx,
      ctx.params.commentId,
      ctx.user.username,
      reply,
      ctx.user.profilePicture
    ));
  ctx.redirect = new Response(null, {
    status: 302,
    headers: { Location: ctx.user ? "/news/" + ctx.params.newsId : "/login" },
  });
  return ctx;
};

export const deleteReply = async (ctx) => {
  const url = new URL(ctx.request.headers.get("referer"));
  const reply = await commentsModel.getReply(ctx, ctx.params.replyId);
  if (reply.author === ctx.user.username || ctx.user.accountType == "admin") {
    await commentsModel.deleteReply(ctx, ctx.params.replyId);
    ctx.redirect = new Response(null, {
      status: 303,
      headers: { Location: url.pathname },
    });
    return ctx;
  } else {
    return ctx;
  }
};
