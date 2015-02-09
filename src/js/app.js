(function(undefined) {
  'use strict';

  angular
    .module('hplcSimulator', ['ngRoute', 'ngMaterial'])

    .config( function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/', {templateUrl: '/html/simulator.html'})
        .when('simulator', {redirectTo: '/'})
        .when('/about', {templateUrl: '/html/home.html'})
        .when('/status', {templateUrl: '/html/status.html'})
        .when('/references', {templateUrl: '/html/references.html'})
        .otherwise({ redirectTo: '/' });
    })

    .config( function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('blue')
    })
  ;

})();
