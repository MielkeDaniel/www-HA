class Router {
  constructor() {
    this.routes = {
      get: [],
      post: [],
    };
  }

  get(path, callback) {
    const pattern = new URLPattern({ pathname: path });
    this.routes.get.push({ pattern, callback });
  }

  post(path, callback) {
    const pattern = new URLPattern({ pathname: path });
    this.routes.post.push({ pattern, callback });
  }

  async handle(ctx) {
    const { method, url } = ctx.request;
    for (const route of this.routes[method.toLowerCase()]) {
      const match = route.pattern.exec(url);
      if (match) {
        ctx.params = match.pathname.groups;
        ctx = await route.callback(ctx);
        break;
      }
    }
    return ctx;
  }
}

export default new Router();
