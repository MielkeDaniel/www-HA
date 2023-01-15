import router from "./routerClass.js";

import * as profileController from "../controller/profileController.js";

router.post(
  /^\/createaccount$/,
  async (ctx) => await profileController.submitCreateAccount(ctx)
);

router.post(
  /^\/login$/,
  async (ctx) => await profileController.submitLogin(ctx)
);

router.post(
  /^\/profile\/[a-zA-Z0-9]+$/,
  async (ctx) => await profileController.changeUsername(ctx)
);

router.get(
  /^\/profile\/[a-zA-Z0-9]+\/changepassword$/,
  async (ctx) => await profileController.changePassword(ctx)
);

router.post(
  /^\/profile\/[a-zA-Z0-9]+\/changepassword$/,
  async (ctx) => await profileController.submitChangePassword(ctx)
);

router.get(/^\/logout$/, async (ctx) => await profileController.logout(ctx));

router.post(
  /^\/changeusername$/,
  async (ctx) => await profileController.changeUsername(ctx)
);

router.post(
  /^\/changedescription$/,
  async (ctx) => await profileController.changeDescription(ctx)
);

router.post(
  /^\/imageupload$/,
  async (ctx) => await profileController.imageUpload(ctx)
);

export default router;
