var HPLC = require("./hplc_globals.js").globals;
var Column = require("./hplc_column.js").Column;
var Compound = require("./hplc_compound.js").Compound;

exports.Simulator = Simulator;

function Simulator() {
  var autoTimeSpan = true;
  Object.defineProperty(this, 'autoTimeSpan', {
    get: function() { return autoTimeSpan; },
    set: function(value) { autoTimeSpan = value; this.update(); }
  });

  var elutionMode = HPLC.elutionModes.isocratic;
  Object.defineProperty(this, 'elutionMode', {
    get: function() { return elutionMode; },
    set: function(value) { elutionMode = value; this.update(); }
  });

  var finalTime = 0;
  Object.defineProperty(this, 'finalTime', {
    get: function() { return finalTime; },
    set: function(value) { finalTime = value; this.update(); }
  });

  /* mL/min */
  var flowRate = 2.0;
  Object.defineProperty(this, 'flowRate', {
    get: function() { return flowRate; },
    set: function(value) { flowRate = value; this.update(); }
  });

  var initialTime = 0;
  Object.defineProperty(this, 'initialTime', {
    get: function() { return initialTime; },
    set: function(value) { initialTime = value; this.update(); }
  });

  /* uL */
  var injectionVolume = 5.0;
  Object.defineProperty(this, 'injectionVolume', {
    get: function() { return injectionVolume; },
    set: function(value) { injectionVolume = value; this.update(); }
  });

  var noise = 2.0;
  Object.defineProperty(this, 'noise', {
    get: function() { return noise ; },
    set: function(value) { noise = value; this.update(); }
  });

  var plotPoints = 3000;
  Object.defineProperty(this, 'plotPoints', {
    get: function() { return plotPoints; },
    set: function(value) { plotPoints = value; this.update(); }
  });

  /* mm ? */
  var postTubingDiameter = 5.0;
  Object.defineProperty(this, 'postTubingDiameter', {
    get: function() { return postTubingDiameter; },
    set: function(value) { postTubingDiameter = value; this.update(); }
  });

  /* cm */
  var postTubingLength = 0;
  Object.defineProperty(this, 'postTubingLength', {
    get: function() { return postTubingLength; },
    set: function(value) { postTubingLength = value; this.update(); }
  });

  var primarySolvent = HPLC.primarySolvents.water;
  Object.defineProperty(this, 'primarySolvent', {
    get: function() { return primarySolvent; },
    set: function(value) { primarySolvent = value; this.update(); }
  });

  var secondPlot = 'No Plot';
  Object.defineProperty(this, 'secondPlot', {
    get: function() { return secondPlot ; },
    set: function(value) { secondPlot = value; this.update(); }
  });

  var secondarySolvent = HPLC.secondarySolvents.acetonitrile;
  Object.defineProperty(this, 'secondarySolvent', {
    get: function() { return secondarySolvent; },
    set: function(value) { secondarySolvent = value; this.update(); }
  });

  var signalOffset = 0;
  Object.defineProperty(this, 'signalOffset', {
    get: function() { return signalOffset; },
    set: function(value) { signalOffset = value; this.update(); }
  });

  Object.defineProperty(this, 'solventFraction', {
    get: function() { return solventPercent / 100; },
    set: function(value) { solventPercent = value * 100; this.update(); }
  });

  var solventPercent = 50;
  Object.defineProperty(this, 'solventPercent', {
    get: function() { return solventPercent; },
    set: function(value) { solventPercent = value; this.update(); }
  });

  /* celsius */
  var temperature = 25;
  Object.defineProperty(this, 'temperature', {
    get: function() { return temperature; },
    set: function(value) { temperature = value; this.update(); }
  });

  var timeConstant = 0.1;
  Object.defineProperty(this, 'timeConstant', {
    get: function() { return timeConstant ; },
    set: function(value) { timeConstant = value; this.update(); }
  });

  var column = new Column('Agilent Zorbax SB-C18');
  Object.defineProperty(this, 'column', {
    get: function() { return column; },
    set: function(value) { column = value; this.update(); }
  });

  var compounds = [
    new Compound('phenol', this.secondarySolvent.name),
  ];
  Object.defineProperty(this, 'compounds', {
    get: function() { return compounds; }
  });
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


/* units: seconds */
var voidTime = function (column) {
  return column.voidVolume / column.flowRate * 60;
};

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
  this.solventMolecularWeight = ((this.solventFraction/100) * (this.solventBaseMolecularWeight - 18)) + 18;;
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
