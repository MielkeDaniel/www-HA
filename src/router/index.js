import router from "./routerClass.js";

import * as controller from "../controller.js";
import * as formController from "../form-controller.js";

router.get(/^\/$/, async (ctx) => await controller.index(ctx));

router.get(/^\/news$/, async (ctx) => await controller.news(ctx));

router.get(/^\/news\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await controller.newsSubPage(ctx, newsId);
});

router.get(/^\/createnews$/, async (ctx) => await controller.createNews(ctx));

router.get(
  /^\/createaccount$/,
  async (ctx) => await controller.createAccount(ctx)
);

router.post(
  /^\/createaccount$/,
  async (ctx) => await formController.submitCreateAccount(ctx)
);

router.get(/^\/login$/, async (ctx) => await controller.login(ctx));

router.post(/^\/login$/, async (ctx) => await formController.submitLogin(ctx));

router.get(/^\/profile\/[a-zA-Z0-9]+$/, async (ctx) => {
  const username = ctx.request.url.split("/")[4];
  console.log(ctx.request.url.split("/")[4]);
  return await controller.profile(ctx, username);
});

router.post(
  /^\/profile\/[a-zA-Z0-9]+$/,
  async (ctx) => await formController.changeUsername(ctx)
);

router.get(
  /^\/profile\/[a-zA-Z0-9]+\/changepassword$/,
  async (ctx) => await controller.changePassword(ctx)
);

router.post(
  /^\/profile\/[a-zA-Z0-9]+\/changepassword$/,
  async (ctx) => await formController.submitChangePassword(ctx)
);

router.post(/^\/comment\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await formController.comment(ctx, commentId);
});

router.post(
  /^\/uploadnews$/,
  async (ctx) => await formController.uploadNews(ctx)
);

router.get(/^\/logout$/, async (ctx) => await formController.logout(ctx));

router.post(
  /^\/changeusername$/,
  async (ctx) => await formController.changeUsername(ctx)
);

router.post(
  /^\/changedescription$/,
  async (ctx) => await formController.changeDescription(ctx)
);

router.post(
  /^\/imageupload$/,
  async (ctx) => await formController.imageUpload(ctx)
);

router.get(/^\/upvote\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await controller.upvoteComment(ctx, commentId);
});

router.get(/^\/downvote\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await controller.downvoteComment(ctx, commentId);
});

router.get(/^\/deletecomment\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await controller.deletecomment(ctx, commentId);
});

router.get(/^\/editnews\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await controller.editNews(ctx, newsId);
});

router.post(/^\/editnews\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await formController.submitEditNews(ctx, newsId);
});

export default router;
