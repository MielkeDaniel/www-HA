import router from "./routerClass.js";

import * as newsController from "../controller/newsController.js";

router.get("/createnews", newsController.createNews);

router.post("/uploadnews", newsController.uploadNews);

router.get("/editnews/:newsId", newsController.editNews);

router.post("/editnews/:newsId", newsController.submitEditNews);

router.post("/deletenews/:newsId", newsController.deleteNewsArticle);

export default router;
