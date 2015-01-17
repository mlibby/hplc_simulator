describe('routes', function() {

  beforeEach(function() {
    module('hplcSimulator');
  });
  
  it('maps root to home', function() {
    inject(function($route) {
      expect($route.routes['/'].templateUrl).toEqual('/html/home.html');
    });
  });
  
  it('maps /simulator to simulator', function() {
    inject(function($route) {
      expect($route.routes['/simulator'].templateUrl).toEqual('/html/simulator.html');
    });
  });
  
  it('maps otherwise to root', function() {
    inject(function($route) {
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });
});
