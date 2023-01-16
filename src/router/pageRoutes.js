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

// change password
router.get("/profile/:username/changepassword", pagesController.changePassword);

// privacy
router.get("/privacy", pagesController.privacy);

// /profile/username
router.get("/profile/:username", pagesController.profile);

// /news/newsId
router.get("/news/:newsId", pagesController.newsSubPage);

// /about
router.get("/about", pagesController.about);

// /profile/username/deleteaccount
router.get("/profile/:username/deleteaccount", pagesController.deleteAccount);

export default router;
