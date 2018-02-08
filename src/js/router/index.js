/**
 * Our Router is an ES6 Class.
 */

export default class Router {

  constructor() {
    this.routes = {};
  }

  /**
   * Route registration method
   * @param   {Object}     routesList         Each route consists of:
   * @param   {String}        rt.path         URL we want to route to.
   * @param   {Function}      rt.template     Template generating method.
   * @param   {Function}      rt.controller   Route controller method.
   */
  registerRoutes(routesList) {
    for (let route in routesList) {

      let rt = routesList[route];

      this.routes[rt.path] = {
        name       : route,
        template   : rt.template,
        controller : rt.controller
      };

    }
  }

  /**
   * Router method
   * Parses the hash & executes routes based on hash components.
   * @param   {Object}   el   Target DOM element for the routers output
   */
  route(el) {

    let hashFrag;
    
    // get the hash value less the '#'. Default to '/'
    if (location.hash) {
      hashFrag = location.hash.slice(1);
    } else {
      hashFrag = '/';
    }

    // split hash value into pieces & format the pieces
    const delimiter = '/';
    const routePieces = hashFrag.split(delimiter);
    const formattedPcs = routePieces.map( p => '/' + p);
    const pieceCount = routePieces.length;
    const subRoute = routePieces[3] || '';
    const baseRoute = pieceCount > 3 ? formattedPcs[1] + formattedPcs[2] : formattedPcs[1];

    // try to fetch a route object from this.routes
    let route = this.routes[baseRoute];

    // redirect to '/' (home) on invalid route
    if (!route) { route = this.routes['/']; }

    // at this point, we should have a target 'el' and a valid route.
    // Call the route's controller, passing in its template and any subRoute.
    if (el && route.controller) {
      route.controller(el, route.template, subRoute);
      return route;
    }

    return false;

  }

};
