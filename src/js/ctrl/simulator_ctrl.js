var HPLC = require('../model/hplc').hplc;

angular
  .module('hplcSimulator')
  .controller('SimulatorCtrl', [ '$window', '$mdUtil', 'chromatogram', SimulatorCtrl ]);

function SimulatorCtrl($window, $mdUtil, chromatogram) {
  this.window = $window;
  this.mdUtil = $mdUtil;
  this.chromatogram = chromatogram;
  var _this = this;

  this.chartSelector = '.chromatogram .chart';
  this.analyteHighlighted = true;
  this.simulator = new HPLC.Simulator(this.drawChromatogram.bind(this));

  this.upgradeCompounds();
  
  this.drawChromatogram();
  this.showCompoundList = false;
  this.selectedTab = 0;
  angular.element($window)
    .bind('resize',
          this.mdUtil.debounce( this.drawChromatogram, 10, this, false));
};

SimulatorCtrl.prototype.toggleCompoundList = function () {
  this.showCompoundList = !this.showCompoundList;
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

SimulatorCtrl.prototype.upgradeCompounds = function () {
  var compoundPrototype = this.simulator.compounds[0].__proto__;

  angular.forEach(this.simulator.compounds, function (compound) {
    compound.highlighted = true;
  });
  
  compoundPrototype.getClassName = function () {
    return this.highlighted ? this.name.toLowerCase().replace(/[^a-z]/ig, '') : null;
  };
};

SimulatorCtrl.prototype.getAnalyteClassName = function () {
  return this.analyteHighlighted ? 'analyte' : null;
};

SimulatorCtrl.prototype.toggleHighlight = function (compound) {
  if(compound === 'analyte') {
    this.analyteHighlighted = !this.analyteHighlighted;
    compound = {name: 'analyte', highlighted: this.analyteHighlighted};
  } else {
    compound.highlighted = !compound.highlighted;
  }
  this.chromatogram.highlight(compound.name, compound.highlighted);
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
