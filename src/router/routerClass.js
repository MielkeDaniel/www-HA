class Router {
  constructor() {
    this.routes = {
      get: [],
      post: [],
    };
  }

  get(path, callback) {
    if (!(path instanceof RegExp)) {
      throw new Error("Routes must be defined using regular expressions");
    }
    this.routes.get.push({ path, callback });
  }

  post(path, callback) {
    if (!(path instanceof RegExp)) {
      throw new Error("Routes must be defined using regular expressions");
    }
    this.routes.post.push({ path, callback });
  }

  async handle(ctx) {
    const { method, url } = ctx.request;
    const path = new URL(url).pathname;
    let match;
    for (const route of this.routes[method.toLowerCase()]) {
      match = path.match(route.path);
      if (match) {
        ctx.params = match.groups;
        ctx = await route.callback(ctx);
        break;
      }
    }
    return ctx;
  }
}

export default new Router();
