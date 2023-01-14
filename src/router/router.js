class Router {
  constructor() {
    this.routes = new Map();
  }

  handle(req) {
    let routeFound = false;
    this.routes.forEach((route, path) => {
      if (req.url.match(path) && req.method === route.method) {
        routeFound = true;
        route.callback(req);
      }
    });

    if (!routeFound) {
      req.respond({ status: 404, body: "Route not found" });
    }
  }

  get(path, callback) {
    this.routes.set(path, { method: "GET", callback });
  }

  post(path, callback) {
    this.routes.set(path, { method: "POST", callback });
  }
}

export default Router;
