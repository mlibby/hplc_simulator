var HPLC = require("../model/hplc").hplc;

angular
  .module('hplcSimulator')
  .controller('SimulatorCtrl', [ '$window', 'chromatogram', SimulatorCtrl ]);

function SimulatorCtrl($window, chromatogram) {
  this.simulator = new HPLC.Simulator();
  this.selectedTab = 0;
  chromatogram.draw(this.simulator, '#chart');

  angular.element($window).bind("resize", function () {
    chromatogram.draw(this.simulator, '#chart');
  });
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
