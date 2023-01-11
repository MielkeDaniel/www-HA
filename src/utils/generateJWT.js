import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";

const generateJWT = async (username) => {
  const payload = {
    iss: username,
    exp: Date.now() + 1000 * 60 * 60, // 1 hour
  };
  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    payload,
    Deno.env.get("JWT_SECRET")
  );
  return jwt;
};

export default generateJWT;
