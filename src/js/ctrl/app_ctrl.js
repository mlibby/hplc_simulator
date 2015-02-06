(function(undefined) {

  angular
    .module('hplcSimulator')
    .controller('AppCtrl', [ '$rootScope', '$scope', '$mdSidenav', '$window', '$location', AppCtrl ]);
  
  function AppCtrl($rootScope, $scope, $mdSidenav, $window, $location) {
    this.rootScope = $rootScope;
    this.scope = $scope;
    this.sidenav = $mdSidenav;
    this.window = $window;
    this.location = $location;

    var _this = this;
    this.rootScope.$watch('pageTitle', function(){
      _this.pageTitle = _this.rootScope.pageTitle;
    });

    this.rootScope.pageTitle = "HPLC Simulator";

    this.rootScope.$on('$viewContentLoaded', function() {
      if (_this.window.ga) {
        _this.window.ga('set', 'page', _this.location.path());
        _this.window.ga('send', 'pageview');
      }
    });
  };

  AppCtrl.prototype.clickNav = function _clickNav() {
    this.sidenav('right').toggle();
  };
})();
