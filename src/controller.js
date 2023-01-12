import * as readUserModel from "./model/readUserModel.js";

export const error404 = (ctx) => {
  ctx.response.body = ctx.nunjucks.render("error404.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const functionality = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("functionality.html", {
    user,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
};

export const governance = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("governance.html", {
    user,
  });
  ctx.response.status = 200;
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

export const about = async (ctx) => {
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  ctx.response.body = ctx.nunjucks.render("about.html", {
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
