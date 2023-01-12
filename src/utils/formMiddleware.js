import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";

const formMiddleware = async (ctx) => {
  const contentType = ctx.request.headers.get("content-type");
  if (contentType && contentType.includes("multipart/form-data")) {
    console.log("test");
    const form = await multiParser(ctx.request);
    console.log(form);
  }
  return ctx;
};

export default formMiddleware;
