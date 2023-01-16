import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import * as readUserModel from "../model/readUserModel.js";
import { getCookies } from "https://deno.land/std@0.171.0/http/cookie.ts";

const userMiddleware = async (ctx) => {
  const jwt = getCookies(ctx.request.headers).jwt || null;

  if (jwt) {
    const payload = await verify(jwt, Deno.env.get("JWT_SECRET"), "HS512");
    const user = await readUserModel.getUser(ctx.db, payload.iss);
    return { ...ctx, user: user };
  }
  return { ...ctx, user: null };
};

export default userMiddleware;
