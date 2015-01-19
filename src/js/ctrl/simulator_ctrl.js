var HPLC = require("../model/hplc").hplc;

angular
  .module('hplcSimulator')
  .controller('SimulatorCtrl', [ SimulatorCtrl ]);

function SimulatorCtrl($rootScope, $scope) {
  this.simulator = new HPLC.Simulator();
  this.selectedTab = 0;
};

SimulatorCtrl.prototype.primarySolvents = function() {
  return HPLC.primarySolvents;
};

SimulatorCtrl.prototype.secondarySolvents = function() {
  return HPLC.secondarySolvents;
};

SimulatorCtrl.prototype.elutionModes = function() {
  return HPLC.elutionModes;
};

SimulatorCtrl.prototype.nextTab = function() {
  if(this.selectedTab < 5) {
    this.selectedTab += 1;
  }
};

SimulatorCtrl.prototype.previousTab = function() {
  if(this.selectedTab > 0) {
    this.selectedTab -= 1;
  }
};
