import 'babel-polyfill';
import { assert } from 'chai';
import Router     from '../src/js/router/index';


describe('Router', () => {

  let router;
  let routeStats;

  // mock controller - just sets properties on local 'routeStats' object
  function fakeController(el, template, subRoute) {
    routeStats.el       = el;
    routeStats.template = template();
    routeStats.subRoute = subRoute;
  }

  // sample routes
  const routesMap = {
    home : {
      path       : '/',
      template   : function() { return 'Hi from the home template!'; },
      controller : fakeController
    },
    test : {
      path       : '/test',
      template   : function() { return 'Hi from the test template!'; },
      controller : fakeController
    }
  };

  // reset route stats and router before each test
  beforeEach(() => {
    routeStats = {};
    router     = new Router();
  });


  describe('route registration', function() {
    
    it('router.registerRoutes should be a function', function() {
      assert.isFunction(router.registerRoutes);
    });

    it('method should register routes passed as a map of routes', function() {
      router.registerRoutes(routesMap);
      assert.hasAllKeys(router.routes, ['/', '/test']);
    });

    it('registered routes should have property "name" (String)', function() {
      router.registerRoutes(routesMap);

      for (let key in router.routes) {
        let r = router.routes[key];
        assert.hasAnyKeys(r, ['name']);
        assert.isString(r.name);
      }

    });

    it('registered routes should have property "template" (Function)', function() {
      router.registerRoutes(routesMap);

      for (let key in router.routes) {
        let r = router.routes[key];
        assert.hasAnyKeys(r, ['template']);
        assert.isFunction(r.template);
      }

    });

    it('registered routes should have property "controller" (Function)', function() {
      router.registerRoutes(routesMap);

      for (let key in router.routes) {
        let r = router.routes[key];
        assert.hasAnyKeys(r, ['controller']);
        assert.isFunction(r.controller);
      }

    });

  });


  describe('routing functionality', function() {

    const el = '<div id="target"></div>';

    it('router.route should be a function', function() {
      assert.isFunction(router.route);
    });

    it('should route based on valid location hash', function() {
      
      // mock window.location.hash global object
      global.location = { hash: '#/test' };
      router.registerRoutes(routesMap);
      let routerResult = router.route(el);

      assert.isOk(routerResult);
      assert.equal(routeStats.template, routesMap.test.template());

    });
    
    it('should redirect to "home" on invalid route paths', function() {
      
      // mock invalid window.location.hash
      global.location = { hash: '#/gibberish_route' };
      
      router.registerRoutes(routesMap);
      let routerResult = router.route(el);

      assert.isOk(routerResult);
      assert.equal(routeStats.template, routesMap.home.template());

    });

    it('should redirect to "home" on missing hash', function() {
      
      // mock missing window.location.hash
      global.location = {};
      
      router.registerRoutes(routesMap);
      let routerResult = router.route(el);

      assert.isOk(routerResult);
      assert.equal(routeStats.template, routesMap.home.template());

    });

    it('should fail when target "el" is omitted', function() {
      
      // mock window.location.hash global object
      global.location = { hash: '#/test' };
      
      router.registerRoutes(routesMap);
      let routerResult = router.route();

      assert.isNotOk(routerResult);
      assert.equal(routerResult, false);

    });

  });

});
