import router from "./routerClass.js";

import * as newsController from "../controller/newsController.js";

router.get(
  /^\/createnews$/,
  async (ctx) => await newsController.createNews(ctx)
);

router.post(
  /^\/uploadnews$/,
  async (ctx) => await newsController.uploadNews(ctx)
);

router.get(/^\/editnews\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await newsController.editNews(ctx, newsId);
});

router.post(/^\/editnews\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await newsController.submitEditNews(ctx, newsId);
});

router.post(/^\/deletenews\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await newsController.deleteNewsArticle(ctx, newsId);
});

export default router;
