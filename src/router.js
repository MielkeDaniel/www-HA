import * as controller from "./controller.js";
import * as formController from "./form-controller.js";

const router = async (ctx) => {
  // PAGES
  if (ctx.response.status === 200) return ctx;
  const url = new URL(ctx.request.url);
  if (url.pathname == "/") return await controller.index(ctx);
  if (url.pathname == "/news") return await controller.news(ctx);
  if (url.pathname == "/createnews") return await controller.createNews(ctx);

  if (url.pathname == "/createaccount") {
    const method = ctx.request.method;
    if (method == "GET") return await controller.createAccount(ctx);
    if (method == "POST") return await formController.submitCreateAccount(ctx);
  }
  if (url.pathname == "/login") {
    const method = ctx.request.method;
    if (method == "GET") return await controller.login(ctx);
    if (method == "POST") return await formController.submitLogin(ctx);
  }

  // profile/username
  const profileRegex = /^\/profile\/[a-zA-Z0-9]+$/;
  if (profileRegex.test(url.pathname)) {
    const method = ctx.request.method;
    if (method == "GET") {
      const username = url.pathname.split("/")[2];
      return await controller.profile(ctx, username);
    }
    if (method == "POST") return await formController.changeUsername(ctx);
  }

  // profile/username/changepassword
  const changePwRegex = /^\/profile\/[a-zA-Z0-9]+\/changepassword/;
  if (changePwRegex.test(url.pathname)) {
    const method = ctx.request.method;
    if (method == "GET") return await controller.changePassword(ctx);
    if (method == "POST") return await formController.submitChangePassword(ctx);
  }

  // API
  if (url.pathname == "/uploadnews") await formController.uploadNews(ctx);
  if (url.pathname == "/logout") return formController.logout(ctx);
  if (url.pathname == "/changeusername")
    return await formController.changeUsername(ctx);
  if (url.pathname == "/changedescription")
    return await formController.changeDescription(ctx);
  if (url.pathname == "/imageupload")
    return await formController.imageUpload(ctx);
  // 404
  return await controller.error404(ctx);
};

export default router;
