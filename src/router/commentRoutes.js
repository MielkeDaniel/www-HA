import router from "./routerClass.js";

import * as commentsController from "../controller/commentsController.js";

router.post("/comment/:newsId", commentsController.comment);

router.post("/upvote/:commentId", commentsController.upvoteComment);

router.post("/downvote/:commentId", commentsController.downvoteComment);

router.post("/deletecomment/:commentId", commentsController.deletecomment);

router.post("/reply/:newsId/:commentId", commentsController.reply);

router.post("/deletereply/:replyId", commentsController.deleteReply);

export default router;
