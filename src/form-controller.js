import * as model from "./model.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const submitLogin = async (ctx) => {
  const formdata = await ctx.request.formData();
  const username = formdata.get("username");
  const password = formdata.get("password");

  const user = await model.getUser(ctx.db, username);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const payload = {
      iss: username,
      exp: Date.now() + 1000 * 60 * 60 * 24, // 1 day
    };
    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      payload,
      Deno.env.get("JWT_SECRET")
    );
    ctx.response.headers["Set-Cookie"] = `jwt=${jwt}; HttpOnly; Path=/`;
    ctx.response.status = 303;
    ctx.response.headers["Location"] = "/";
    return ctx;
  } else {
    ctx.response.body = ctx.nunjucks.render("login.html", {
      form: { username: username, password: password },
      errors: { password: "Invalid password" },
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

export const submitCreateAccount = async (ctx) => {
  const formdata = await ctx.request.formData();
  const username = formdata.get("username");
  const password = formdata.get("password");
  const valPassword = formdata.get("valPassword");

  const isPasswordValid = password === valPassword;
  const userExists = await model.userExists(ctx.db, username);

  const errors = {};

  if (isPasswordValid && !userExists) {
    model.createUser(ctx.db, username, password);
    ctx.redirect = new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
    return ctx;
  } else {
    !isPasswordValid && (errors.password = "Passwords do not match");
    userExists && (errors.username = "Username already exists");
    ctx.response.body = ctx.nunjucks.render("createAccount.html", {
      form: { username: username, password: password },
      errors: errors,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }

  return ctx;
};
