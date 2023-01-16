import * as readUserModel from "../model/readUserModel.js";
import * as newsModel from "../model/newsModel.js";
import * as commentsModel from "../model/commentsModel.js";
import * as dominicsModel from "../dominicsPersonalFolder/dominicsModel.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const newsSubPage = async (ctx) => {
  const news = await newsModel.getNewsById(ctx, ctx.params.newsId);
  const comments = await commentsModel.getComments(ctx, ctx.params.newsId);
  if (news === false || news === undefined) {
    ctx.response.body = ctx.nunjucks.render("newsSubPage.html", {
      errors: { news: "News-article not found!" },
      user: ctx.user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    ctx.response.body = ctx.nunjucks.render("newsSubPage.html", {
      news,
      user: ctx.user,
      comments,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

export const news = async (ctx) => {
  const news = await newsModel.getNews(ctx);
  ctx.response.body = ctx.nunjucks.render("news.html", {
    news,
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const createAccount = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("createAccount.html", {
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const login = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("login.html", {
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const index = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("index.html", {
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const profile = async (ctx) => {
  const userInfo = await readUserModel.getUser(ctx.db, ctx.params.username);
  const isProfileOwner = ctx.params.username === ctx.user.username;

  if (isProfileOwner) {
    ctx.response.body = ctx.nunjucks.render("profile.html", {
      user: ctx.user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    ctx.response.body = ctx.nunjucks.render("staticProfile.html", {
      profile: userInfo,
      user: ctx.user,
    });
    ctx.response.status = userInfo ? 200 : 404;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

export const error404 = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("error404.html", {
    user: { username: ctx.user },
  });
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const colophon = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("colophon.html", {
    user: { username: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const imprint = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("imprint.html", {
    user: { username: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const privacy = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("privacy.html", {
    user: { username: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const about = async (ctx) => {
  const quote = await dominicsModel.getDominicsQuote(ctx);
  ctx.response.body = ctx.nunjucks.render("about.html", {
    dominic: { quote },
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const deleteAccount = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("deleteAccount.html", {
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const changePassword = (ctx) => {
  if (!ctx.user) {
    // redirect to login
    ctx.redirect = new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
    return ctx;
  }
  ctx.response.body = ctx.nunjucks.render("changePassword.html", {
    user: ctx.user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};
