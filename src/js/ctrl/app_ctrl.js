(function(undefined) {

  angular
    .module('hplcSimulator')
    .controller('AppCtrl', [ '$rootScope', '$scope', '$mdSidenav', AppCtrl ]);
  
  function AppCtrl($rootScope, $scope, $mdSidenav) {
    this.rootScope = $rootScope;
    this.scope = $scope;
    this.sidenav = $mdSidenav;

    var _this = this;
    this.rootScope.$watch('pageTitle', function(){
      _this.pageTitle = _this.rootScope.pageTitle;
    });

    this.rootScope.pageTitle = "HPLC Simulator";
  };

  AppCtrl.prototype.clickNav = function _clickNav() {
    this.sidenav('right').toggle();
  };
})();
