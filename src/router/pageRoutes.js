import router from "./routerClass.js";

import * as pagesController from "../controller/pagesController.js";

// index
router.get("/", pagesController.index);

// news
router.get("/news", pagesController.news);

// login
router.get("/login", pagesController.login);

// create account
router.get("/createaccount", pagesController.createAccount);

// colophon
router.get("/colophon", pagesController.colophon);

// imprint
router.get("/imprint", pagesController.imprint);

// privacy
router.get("/privacy", pagesController.privacy);

// /profile/username
router.get("/profile/:username", pagesController.profile);

// /news/newsId
router.get("/news/:newsId", pagesController.newsSubPage);

// /about
router.get("/about", pagesController.about);

export default router;
