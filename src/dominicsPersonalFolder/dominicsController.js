import * as dominicsModel from "./dominicsModel.js";

export const updateQuote = async (ctx) => {
  const formdata = await ctx.request.formData();
  const quote = formdata.get("quote");
  await dominicsModel.setDominicsQuote(ctx, quote);
  ctx.redirect = new Response(null, {
    status: 303,
    headers: { Location: "/about" },
  });
  return ctx;
};
