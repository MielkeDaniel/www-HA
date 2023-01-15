import * as readUserModel from "../model/readUserModel.js";
import * as newsModel from "../model/newsModel.js";
import uploadArticleImage from "../utils/safeArticleImage.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

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

export const deleteNewsArticle = async (ctx, newsId) => {
  await newsModel.deleteNewsArticle(ctx, newsId);
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: "/news" },
  });
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

export const submitEditNews = async (ctx, newsId) => {
  const formdata = await ctx.request.formData();
  const title = formdata.get("title");
  const subtitle = formdata.get("subtitle");
  const image = formdata.get("image");
  const article = formdata.get("article");

  const imageName = await uploadArticleImage(image);

  await newsModel.editNews(ctx, newsId, title, subtitle, article, imageName);
  ctx.redirect = new Response(null, {
    status: 302,
    headers: { Location: "/news/" + newsId },
  });
  return ctx;
};

export const uploadNews = async (ctx) => {
  const formdata = await ctx.request.formData();
  const title = formdata.get("title");
  const subtitle = formdata.get("subtitle");
  const image = formdata.get("image");
  const article = formdata.get("article");

  const imageName = await uploadArticleImage(image);

  await newsModel.createNews(
    ctx,
    title,
    subtitle,
    article,
    imageName,
    ctx.user
  );
  ctx.redirect = new Response(null, {
    status: 302,
    headers: { Location: "/news" },
  });
  return ctx;
};
