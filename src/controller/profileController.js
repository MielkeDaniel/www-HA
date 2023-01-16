import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

import * as readUserModel from "../model/readUserModel.js";
import * as changeUserModel from "../model/changeUserModel.js";
import generateJWT from "../utils/generateJWT.js";
import validateImage from "../utils/validateImage.js";
import uploadProfilePicture from "../utils/uploadProfilePicture.js";

export const imageUpload = async (ctx) => {
  const formdata = await ctx.request.formData();
  const image = formdata.get("image");
  const username = ctx.user.username;
  const error = validateImage(image);

  if (error) {
    ctx.response.status = 303;
    ctx.response.headers["Location"] = "/profile/" + username;
    ctx.response.headers["content-type"] = "text/html";
    return ctx;
  } else {
    await uploadProfilePicture(ctx, image);
    ctx.redirect = new Response(null, {
      status: 302,
      headers: { Location: "/profile/" + username },
    });
    return ctx;
  }
};

export const submitChangePassword = async (ctx) => {
  const userPw = await readUserModel.getUserPassword(ctx.db, ctx.user.username);
  const formData = await ctx.request.formData();
  const oldPassword = formData.get("oldPw");
  const newPassword = formData.get("newPw");
  const newPassword2 = formData.get("newValPw");

  const isPasswordLengthValid = newPassword.length >= 4;
  const isPasswordValid = await bcrypt.compare(oldPassword, userPw);
  const isPasswordMatch = newPassword === newPassword2;
  const isNotSamePassword = newPassword !== oldPassword;

  if (
    isPasswordValid &&
    isPasswordMatch &&
    isNotSamePassword &&
    isPasswordLengthValid
  ) {
    changeUserModel.changePassword(ctx.db, ctx.user.username, newPassword);
    ctx.response.status = 303;
    ctx.response.headers["Location"] = "/profile/" + ctx.user.username;
  } else {
    ctx.response.body = ctx.nunjucks.render("changePassword.html", {
      user: { username: ctx.user.username },
      form: { oldPw: oldPassword, newPw: newPassword, newValPw: newPassword2 },
      errors: {
        oldPassword: !isPasswordValid ? "Invalid password" : "",
        newPassword: !isPasswordMatch ? "Passwords do not match" : "",
        samePassword: !isNotSamePassword
          ? "New password cannot be the same"
          : "",
        passwordLength: !isPasswordLengthValid ? "Password too short" : "",
      },
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};

export const submitLogin = async (ctx) => {
  const formdata = await ctx.request.formData();
  const username = formdata.get("username");
  const password = formdata.get("password");

  const userPw = await readUserModel.getUserPassword(ctx.db, username);
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
  const isPasswordLengthValid = password.length >= 4;
  const userExists = await readUserModel.userExists(ctx.db, username);

  const errors = {};

  if (isPasswordValid && !userExists && isPasswordLengthValid) {
    changeUserModel.createUser(ctx.db, username, password);
    ctx.redirect = new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
    return ctx;
  } else {
    !isPasswordValid && (errors.password = "Passwords do not match");
    userExists && (errors.username = "Username already exists");
    !isPasswordLengthValid && (errors.passwordLength = "Password too short");
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
  const newUsername = formdata.get("username");

  if (newUsername) {
    const userExists = await readUserModel.getUser(ctx.db, newUsername);
    if (userExists) {
      ctx.response.body = ctx.nunjucks.render("profile.html", {
        user: ctx.user,
        errors: { username: "Username already exists" },
      });
      ctx.response.status = 200;
      ctx.response.headers["content-type"] = "text/html";
      return ctx;
    } else {
      changeUserModel.changeUsername(ctx.db, ctx.user.username, newUsername);
      const jwt = await generateJWT(newUsername);
      ctx.response.headers["Set-Cookie"] = `jwt=${jwt}; HttpOnly; Path=/`;
      ctx.user = newUsername;
      ctx.response.status = 303;
      ctx.response.headers["Location"] = "/profile/" + newUsername;
      return ctx;
    }
  } else {
    ctx.response.body = ctx.nunjucks.render("profile.html", {
      user: ctx.user,
      errors: { username: "Username cannot be empty" },
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
    return ctx;
  }
};

export const changeDescription = async (ctx) => {
  const formdata = await ctx.request.formData();
  const description = formdata.get("description");

  changeUserModel.changeDescription(ctx.db, ctx.user.username, description);
  ctx.response.status = 303;
  ctx.response.headers["Location"] = "/profile/" + ctx.user.username;
  return ctx;
};

export const deleteAccount = async (ctx) => {
  const formdata = await ctx.request.formData();
  const password = formdata.get("password");
  const userPw = await readUserModel.getUserPassword(ctx.db, ctx.user.username);
  const isPasswordValid = await bcrypt.compare(password, userPw);

  if (isPasswordValid) {
    changeUserModel.deleteUser(ctx.db, ctx.user.username);
    ctx.response.headers["Set-Cookie"] = `jwt=; HttpOnly; Path=/`;
    ctx.response.status = 303;
    ctx.response.headers["Location"] = "/";
  } else {
    ctx.response.body = ctx.nunjucks.render("deleteAccount.html", {
      user: ctx.user,
      errors: { password: "Invalid password" },
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  return ctx;
};
