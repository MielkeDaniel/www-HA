import router from "./routerClass.js";

import * as commentsController from "../controller/commentsController.js";

router.post(/^\/comment\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await commentsController.comment(ctx, commentId);
});

router.post(/^\/upvote\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await commentsController.upvoteComment(ctx, commentId);
});

router.post(/^\/downvote\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await commentsController.downvoteComment(ctx, commentId);
});

router.post(/^\/deletecomment\/[0-9]+$/, async (ctx) => {
  const commentId = ctx.request.url.split("/")[4];
  return await commentsController.deletecomment(ctx, commentId);
});

export default router;
