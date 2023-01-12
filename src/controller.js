import * as readUserModel from "./model/readUserModel.js";
import * as newsModel from "./model/newsModel.js";

export const error404 = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("error404.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const createAccount = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("createAccount.html", {
    user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const login = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("login.html", {
    user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const index = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("index.html", {
    user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const profile = async (ctx, profilename) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  const userInfo = await readUserModel.getUser(ctx.db, profilename);
  const isProfileOwner = profilename === ctx.user;

  if (isProfileOwner) {
    ctx.response.body = ctx.nunjucks.render("profile.html", {
      user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    ctx.response.body = ctx.nunjucks.render("staticProfile.html", {
      profile: userInfo,
      user,
    });
    ctx.response.status = userInfo ? 200 : 404;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

export const changePassword = async (ctx) => {
  if (!ctx.user) {
    // redirect to login
    ctx.redirect = new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
    return ctx;
  }
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("changePassword.html", {
    user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const news = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  const news = await newsModel.getNews(ctx);
  ctx.response.body = ctx.nunjucks.render("news.html", {
    news,
    user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const createNews = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);

  const isAdmin = user && user.accountType === "admin";
  if (!isAdmin) {
    ctx.response.body = ctx.nunjucks.render("createNews.html", {
      user,
      errors: { admin: "You need to be an admin to create news-articles!" },
    });
    ctx.response.status = 403;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    ctx.response.body = ctx.nunjucks.render("createNews.html", {
      user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};
