import 'babel-polyfill';
import { assert } from 'chai';
import Router     from '../src/js/router/index';


describe('Router', function() {

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
  beforeEach(function() {
    routeStats = {};
    router     = new Router();
  });

  // reset global object after all tests
  after(function() {
    delete global.location;
  });

  describe('instances', function() {
    
    it('should be an object', function() {
      assert.isObject(router);
    });

    it('should have a property "routes" (Object)', function() {
      assert.isObject(router.routes);
    });

    it('should have a method "registerRoutes"', function() {
      assert.isFunction(router.registerRoutes);
    });

    it('should have a method "route"', function() {
      assert.isFunction(router.route);
    });

  });


  describe('.registerRoutes() method', function() {
    
    it('should be a function', function() {
      assert.isFunction(router.registerRoutes);
    });

    it('should register routes passed as a map of routes', function() {
      router.registerRoutes(routesMap);
      assert.hasAllKeys(router.routes, ['/', '/test']);
    });

    it('should register routes with a property "name" (String)', function() {
      router.registerRoutes(routesMap);

      for (let key in router.routes) {
        assert.isString(router.routes[key].name);
      }

    });

    it('should register routes with a method "template"', function() {
      router.registerRoutes(routesMap);

      for (let key in router.routes) {
        assert.isFunction(router.routes[key].template);
      }

    });

    it('should register routes with a method "controller"', function() {
      router.registerRoutes(routesMap);

      for (let key in router.routes) {
        assert.isFunction(router.routes[key].controller);
      }

    });

  });


  describe('.route() method', function() {

    const el = '<div id="target"></div>';

    it('should be a function', function() {
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
    
    it('should redirect to "home" on unrecognized location hash', function() {
      
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

    it('should return false when target "el" is omitted', function() {
      
      // mock window.location.hash global object
      global.location = { hash: '#/test' };
      
      router.registerRoutes(routesMap);
      let routerResult = router.route();

      assert.isNotOk(routerResult);
      assert.equal(routerResult, false);

    });

  });

});
