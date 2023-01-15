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
  console.log(ctx.user);

  if (isProfileOwner) {
    console.log("am owner");
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

export const newsSubPage = async (ctx, newsId) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  const news = await newsModel.getNewsById(ctx, newsId);
  const comments = await newsModel.getComments(ctx, newsId);
  if (news === false || news === undefined) {
    ctx.response.body = ctx.nunjucks.render("newsSubPage.html", {
      errors: { news: "News-article not found!" },
      user,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    ctx.response.body = ctx.nunjucks.render("newsSubPage.html", {
      news,
      user,
      comments,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

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

export const editNews = async (ctx, newsId) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  const news = await newsModel.getNewsById(ctx, newsId);
  const isAdmin = user && user.accountType === "admin";
  if (!isAdmin || news === false) {
    ctx.response.body = ctx.nunjucks.render("editNews.html", {
      user,
      errors: {
        admin:
          "The news either does not exist or your account does not have the priviledge to edit this articles.",
      },
    });
    ctx.response.status = 403;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    ctx.response.body = ctx.nunjucks.render("editNews.html", {
      user,
      news,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

export const deleteNews = async (ctx, newsId) => {
  await newsModel.deleteNews(ctx, newsId);
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: "/news" },
  });
};
