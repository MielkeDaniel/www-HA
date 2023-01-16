import router from "./routerClass.js";

import * as profileController from "../controller/profileController.js";

router.post("/login", profileController.submitLogin);

router.post("/logout", profileController.logout);

router.post("/changeusername", profileController.changeUsername);

router.post("/imageupload", profileController.imageUpload);

router.post("/profile/:username", profileController.changeUsername);

router.post("/createaccount", profileController.submitCreateAccount);

router.get(
  "/profile/:username/changepassword",
  profileController.changePassword
);

router.post(
  "/profile/:username/changepassword",
  profileController.submitChangePassword
);

router.post("/changedescription", profileController.changeDescription);

router.post(
  "/profile/:username/deleteaccount",
  profileController.deleteAccount
);

export default router;
