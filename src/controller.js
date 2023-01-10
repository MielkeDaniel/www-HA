export function error404(ctx) {
  ctx.response.body = ctx.nunjucks.render("error404.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function functionality(ctx) {
  ctx.response.body = ctx.nunjucks.render("functionality.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function governance(ctx) {
  ctx.response.body = ctx.nunjucks.render("governance.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function createAccount(ctx) {
  ctx.response.body = ctx.nunjucks.render("createAccount.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function login(ctx) {
  ctx.response.body = ctx.nunjucks.render("login.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function about(ctx) {
  ctx.response.body = ctx.nunjucks.render("about.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function index(ctx) {
  ctx.response.body = ctx.nunjucks.render("index.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function profile(ctx) {
  ctx.response.body = ctx.nunjucks.render("profile.html", {
    user: { name: ctx.user },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
