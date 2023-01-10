import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { getCookies } from "https://deno.land/std@0.171.0/http/cookie.ts";

const userMiddleware = async (ctx, key) => {
  const jwt = getCookies(ctx.request.headers).jwt || null;

  if (jwt) {
    const payload = await verify(jwt, key, { isThrowing: false });
    console.log(payload);
  }
};

export default userMiddleware;
