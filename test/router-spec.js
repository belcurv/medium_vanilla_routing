import 'babel-polyfill';
import { assert } from 'chai';
import Router     from '../src/js/router/index';


describe('Router', () => {

  let router;

  const routesMap = {
    home : {
      path       : '/',
      template   : () => 'home template',
      controller : () => 'home controller'
    },
    test : {
      path       : '/test',
      template   : () => 'test template',
      controller : () => 'test controller'
    }
  };


  beforeEach(() => {
    router = new Router();
  });


  describe('route registration', () => {
    
    it('router.registerRoutes should be a function', () => {
      assert.isFunction(router.registerRoutes);
    });

    it('should register routes passed as a map of routes', () => {
      router.registerRoutes(routesMap);

      assert.isObject(router.routes);
      assert.hasAllKeys(router.routes, ['/', '/test']);

      for (let key in router.routes) {
        let r = router.routes[key];
        assert.hasAllKeys(r, ['name', 'template', 'controller']);
        assert.isString(r.name);
        assert.isFunction(r.template);
        assert.isFunction(r.controller);
      }
     
    });

  });


  describe('routing', () => {

    const el = '<div id="target"></div>';

    it('router.route should be a function', () => {
      assert.isFunction(router.route);
    });

    it('should route without crashing', () => {
      router.registerRoutes(routesMap);
      
      // mock window.location.hash global object
      global.location = {
        hash: '#/test'
      };
      
      let routerResult = router.route(el);
      assert.isOk(routerResult);
      assert.equal(routerResult.name, 'test');

    });
    
    it('should redirect to "home" on invalid route paths', () => {
      router.registerRoutes(routesMap);

      // mock invalid window.location.hash
      global.location = {
        hash: '#/gibberish_route'
      };

      let routerResult = router.route(el);
      assert.isOk(routerResult);
      assert.equal(routerResult.name, 'home');

    });

    it('should redirect to "home" on missing hash', () => {
      router.registerRoutes(routesMap);

      // mock missing window.location.hash
      global.location = {};

      let routerResult = router.route(el);
      assert.isOk(routerResult);
      assert.equal(routerResult.name, 'home');

    });

    it('should fail when target "el" is omitted', () => {
      router.registerRoutes(routesMap);
      
      // mock window.location.hash global object
      global.location = {
        hash: '#/test'
      };
      
      let routerResult = router.route();
      assert.isNotOk(routerResult);
      assert.equal(routerResult, false);
    });

  });

});
