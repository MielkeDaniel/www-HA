import * as controller from "./controller.js";
import * as formController from "./form-controller.js";

const router = async (ctx) => {
  if (ctx.response.status === 200) return ctx;
  const url = new URL(ctx.request.url);
  if (url.pathname == "/") return await controller.index(ctx);
  if (url.pathname == "/functionality")
    return await controller.functionality(ctx);
  if (url.pathname == "/governance") return await controller.governance(ctx);
  if (url.pathname == "/about") return await controller.about(ctx);
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

  return await controller.error404(ctx);
};

export default router;
