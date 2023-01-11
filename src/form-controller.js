import * as model from "./model.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as path from "https://deno.land/std@0.171.0/path/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

import generateJWT from "./utils/generateJWT.js";
import validateImage from "./utils/validateImage.js";
import generateFilename from "./utils/generateFilename.js";

export const submitLogin = async (ctx) => {
  const formdata = await ctx.request.formData();
  const username = formdata.get("username");
  const password = formdata.get("password");

  const userPw = await model.getUserPassword(ctx.db, username);
  const isPasswordValid = await bcrypt.compare(password, userPw);

  if (isPasswordValid) {
    const jwt = await generateJWT(username);
    ctx.response.headers["Set-Cookie"] = `jwt=${jwt}; HttpOnly; Path=/`;
    ctx.response.status = 303;
    ctx.response.headers["Location"] = "/";
    return ctx;
  } else {
    ctx.response.body = ctx.nunjucks.render("login.html", {
      form: { username: username, password: password },
      errors: { password: "Invalid password or username" },
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

export const logout = (ctx) => {
  ctx.response.headers["Set-Cookie"] = `jwt=; HttpOnly; Path=/`;
  ctx.response.status = 303;
  ctx.response.headers["Location"] = "/";
  return ctx;
};

export const changeUsername = async (ctx) => {
  const formdata = await ctx.request.formData();
  const username = ctx.user;
  const newUsername = formdata.get("username");

  model.changeUsername(ctx.db, username, newUsername);
  const jwt = await generateJWT(newUsername);
  ctx.response.headers["Set-Cookie"] = `jwt=${jwt}; HttpOnly; Path=/`;
  ctx.user = newUsername;
  ctx.response.status = 303;
  ctx.response.headers["Location"] = "/profile/" + newUsername;
  return ctx;
};

export const changeDescription = async (ctx) => {
  const formdata = await ctx.request.formData();
  const username = ctx.user;
  const description = formdata.get("description");

  model.changeDescription(ctx.db, username, description);
  ctx.response.status = 303;
  ctx.response.headers["Location"] = "/profile/" + username;
  return ctx;
};

export const imageUpload = async (ctx) => {
  const formdata = await ctx.request.formData();
  const image = formdata.get("image");
  const username = ctx.user;
  const error = validateImage(image);

  if (error) {
    ctx.response.body = ctx.nunjucks.render("login.html", {
      errors: error,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
    return ctx;
  } else {
    const filename = generateFilename(image);
    model.imageUpload(ctx.db, username, filename);
    const destFile = await Deno.open(
      path.join(Deno.cwd(), "assets", filename),
      { create: true, write: true, truncate: true }
    );
    await image.stream().pipeTo(destFile.writable);
    ctx.redirect = new Response(null, {
      status: 302,
      headers: { Location: "/profile/" + username },
    });
    return ctx;
  }
};
