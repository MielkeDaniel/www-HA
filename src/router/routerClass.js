class Router {
  constructor() {
    this.routes = {
      get: {},
      post: {},
    };
  }

  get(path, callback) {
    this.routes.get[path] = callback;
  }

  post(path, callback) {
    this.routes.post[path] = callback;
  }

  async handle(ctx) {
    if (ctx.response.status === 200) return ctx;
    const { method, url } = ctx.request;
    const path = new URL(url).pathname;

    for (const route in this.routes[method.toLowerCase()]) {
      const regex = new RegExp(route);
      if (regex.test(path)) {
        console.log(regex, path);
        ctx = await this.routes[method.toLowerCase()][route](ctx);
        return ctx;
      }
    }
    return ctx;
    // if (
    //   this.routes[method.toLowerCase()] &&
    //   this.routes[method.toLowerCase()][path]
    // ) {
    //   ctx = await this.routes[method.toLowerCase()][path](ctx);
    // }
    // return ctx;
  }
}

export default new Router();
