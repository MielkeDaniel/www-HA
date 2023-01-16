import router from "../router/routerClass.js";

import * as dominicsController from "./dominicsController.js";

router.post("/updateQuote", dominicsController.updateQuote);

export default router;
