(function(undefined) {
  'use strict';

  angular
    .module('hplcSimulator', ['ngRoute', 'ngMaterial'])

    .config( function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/', {templateUrl: '/html/home.html'})
        .when('/simulator', {templateUrl: '/html/simulator.html'})
        .when('/references', {templateUrl: '/html/references.html'})
        .otherwise({ redirectTo: '/' });
    });

})();
