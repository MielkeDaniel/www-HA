import Router from "./router.js";

const router = new Router();

router.get("/", (ctx) => {
  console.log("works");
});

export default router;
