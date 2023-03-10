import pageRouter from "./pageRoutes.js";
import profileRouter from "./profileRoutes.js";
import newsRouter from "./newsRoutes.js";
import commentRouter from "./commentRoutes.js";

import dominicsRouter from "../dominicsPersonalFolder/dominicsPersonalRouter.js";

const routesHandler = async (ctx) => {
  let result;

  result = await pageRouter.handle(ctx);
  if (result) return result;
  result = await profileRouter.handle(ctx);
  if (result) return result;
  result = await newsRouter.handle(ctx);
  if (result) return result;
  result = await commentRouter.handle(ctx);
  if (result) return result;
  result = await dominicsRouter.handle(ctx);

  return result;
};

export default routesHandler;
