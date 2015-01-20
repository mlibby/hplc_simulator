var HPLC = require("./hplc_globals.js").globals;
var Column = require("./hplc_column.js").Column;
var Compound = require("./hplc_compound.js").Compound;

exports.Simulator = Simulator;

function Simulator() {
  this.primarySolvent = HPLC.primarySolvents.water;
  this.secondarySolvent = HPLC.secondarySolvents.acetonitrile;
  this.elutionMode = HPLC.elutionModes.isocratic;
  this.solventFraction = 50;

  this.temperature = 25.0;
  this.injectionVolume = 5.0;
  this.flowRate = 2.0;

  this.secondPlot = 'No Plot';
  
  this.column = new Column('Agilent Zorbax SB-C18');
  
  this.timeConstant = 0.1;
  this.signalOffset = 0;
  this.noise = 2.0;
  this.autoTimeSpan = true;
  this.initialTime = 0;
  this.finalTime = 0;
  this.plotPoints = 3000;

  this.postTubingLength = 0;
  this.postTubingDiameter = 5.0;

  this.compounds = [
    new Compound('phenol', this.secondarySolvent.name),
  ];

  this.update();
};

Simulator.prototype.update = function () {
  this.column.update();
  this.updateOpenTubeFlowVelocity();
  this.updateChromatographicFlowVelocity();
  this.updateInterstitialFlowVelocity();
  this.updateAssociationParameter();
  this.updateSolventMolecularWeight();
  this.updateTempKelvin();
  this.updateEluentViscosity();
  this.updateAverageMolarVolume();
  this.updateDiffusionCoefficient();
  this.updateReducedFlowVelocity();
};

// Simulator.prototype.update = function () {
//   this. = ;
// };

Simulator.prototype.updateReducedFlowVelocity = function () {
  this.reducedFlowVelocity = ((this.column.particleSize / 10000) * this.interstitialFlowVelocity) / this.diffusionCoefficient;
};

Simulator.prototype.updateDiffusionCoefficient = function () {
  this.diffusionCoefficient = 0.000000074 * (Math.pow(this.associationParameter * this.solventMolecularWeight, 0.5) * this.tempKelvin) / (this.eluentViscosity * Math.pow(this.averageMolarVolume, 0.6));
};

Simulator.prototype.updateAverageMolarVolume = function () {
  this.averageMolarVolume = 0;
  for (var i in this.compounds) {
    this.averageMolarVolume += this.compounds[i].molarVolume;
  }
  this.averageMolarVolume /= this.compounds.length;
};

Simulator.prototype.updateEluentViscosity = function () {
  this.eluentViscosity = this.secondarySolvent.eluentViscosity(
    this.solventFraction / 100,
    this.tempKelvin
  );
};

Simulator.prototype.updateTempKelvin = function () {
  this.tempKelvin = (this.temperature / 100) + 273.15;
};


Simulator.prototype.updateSolventMolecularWeight = function () {
  this.solventBaseMolecularWeight = this.secondarySolvent.molecularWeight;
  this.solventMolecularWeight = (this.solventFraction * (this.solventBaseMolecularWeight - 18)) + 18;;
};

Simulator.prototype.updateAssociationParameter = function () {
  this.associationParameter = ((1 - (this.solventFraction/100)) * (2.6 - 1.9)) + 1.9;
};

Simulator.prototype.updateInterstitialFlowVelocity = function () {
  this.interstitialFlowVelocity = this.openTubeFlowVelocity / this.column.interparticlePorosity;
};

Simulator.prototype.updateChromatographicFlowVelocity = function () {
  this.chromatographicFlowVelocity = this.openTubeFlowVelocity / this.column.totalPorosity;
};

Simulator.prototype.updateOpenTubeFlowVelocity = function () {
  this.openTubeFlowVelocity = this.flowRate / this.column.area;
};




