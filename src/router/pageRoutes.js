import router from "./routerClass.js";

import * as pagesController from "../controller/pagesController.js";

router.get(/^\/$/, async (ctx) => await pagesController.index(ctx));

// /profile/username
router.get(/^\/profile\/[a-zA-Z0-9]+$/, async (ctx) => {
  const username = ctx.request.url.split("/")[4];
  return await pagesController.profile(ctx, username);
});

router.get(/^\/news$/, async (ctx) => await pagesController.news(ctx));

// /news/newsId
router.get(/^\/news\/[0-9]+$/, async (ctx) => {
  const newsId = ctx.request.url.split("/")[4];
  return await pagesController.newsSubPage(ctx, newsId);
});

router.get(/^\/login$/, async (ctx) => await pagesController.login(ctx));

router.get(
  /^\/createaccount$/,
  async (ctx) => await pagesController.createAccount(ctx)
);

// colophon
router.get(/^\/colophon$/, async (ctx) => await pagesController.colophon(ctx));

// imprint
router.get(/^\/imprint$/, async (ctx) => await pagesController.imprint(ctx));

// privacy
router.get(/^\/privacy$/, async (ctx) => await pagesController.privacy(ctx));

export default router;
