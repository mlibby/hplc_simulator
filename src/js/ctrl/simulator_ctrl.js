var HPLC = require('../model/hplc').hplc;

angular
  .module('hplcSimulator')
  .controller('SimulatorCtrl', [ '$window', '$mdUtil', 'chromatogram', SimulatorCtrl ]);

function SimulatorCtrl($window, $mdUtil, chromatogram) {
  this.window = $window;
  this.mdUtil = $mdUtil;
  this.chromatogram = chromatogram;
  var _this = this;

  this.chartSelector = '#chart';
  this.simulator = new HPLC.Simulator(this.drawChromatogram.bind(this));
  this.drawChromatogram();
  this.selectedTab = 0;
  angular.element($window)
    .bind('resize',
          this.mdUtil.debounce( this.drawChromatogram, 10, this, false));
};

SimulatorCtrl.prototype.clearChromatogram = function () {
  if(this.simulator) {
    this.chromatogram.clear(this.chartSelector);
  }
};

SimulatorCtrl.prototype.drawChromatogram = function () {
  if(this.simulator) {
    this.chromatogram.draw(this.simulator, this.chartSelector);
  }
};

SimulatorCtrl.prototype.primarySolvents = function () {
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
