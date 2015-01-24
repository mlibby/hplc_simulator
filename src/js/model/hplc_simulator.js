'use strict';

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

  var gradientStops = [
    {time: 0, percent: 5.0},
    {time: 5, percent: 50}
  ];
  Object.defineProperty(this, 'gradientStops', {
    get: function() { return gradientStops; }
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

  /* uL */
  var mixingVolume = 200.0;
  Object.defineProperty(this, 'mixingVolume', {
    get: function() { return mixingVolume; },
    set: function(value) { mixingVolume = value; this.update(); }
  });
  
  var noise = 2.0;
  Object.defineProperty(this, 'noise', {
    get: function() { return noise ; },
    set: function(value) { noise = value; this.update(); }
  });

  /* uL */
  var nonMixingVolume = 200.0;
  Object.defineProperty(this, 'nonMixingVolume', {
    get: function() { return nonMixingVolume; },
    set: function(value) { nonMixingVolume = value; this.update(); }
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
    new Compound('phenol', this.secondarySolvent.name, 5),
    new Compound('3-phenyl propanol', this.secondarySolvent.name, 25),
    new Compound('acetophenone', this.secondarySolvent.name, 40),
    new Compound('p-chlorophenol', this.secondarySolvent.name, 15),
    new Compound('p-nitrotoluene', this.secondarySolvent.name, 10)
  ];

  Object.defineProperty(this, 'compounds', {
    get: function() { return compounds; }
  });

  Object.defineProperty(this, 'backpressureBar', {
    get: function() { return this.backpressure / 100000; }
  });

  this.update();
};

Simulator.prototype.update = function () {
  this.postTubingVolume = postTubingVolume(this);
  this.voidTime = voidTime(this);
  this.openTubeFlowVelocity = openTubeFlowVelocity(this);
  this.chromatographicFlowVelocity = chromatographicFlowVelocity(this);
  this.interstitialFlowVelocity = interstitialFlowVelocity(this);
  this.eluentViscosity = eluentViscosity(this);
  this.diffusionCoefficient = diffusionCoefficient(this);
  this.reducedFlowVelocity = reducedFlowVelocity(this);
  this.reducedPlateHeight = reducedPlateHeight(this);
  this.backpressure = backpressure(this);
  this.hetp = hetp(this);
  this.theoreticalPlates = theoreticalPlates(this);
  this.dwellVolume = dwellVolume(this);
  this.dwellTime = dwellTime(this);
};

// Simulator.prototype.update = function () {
//   this. = ;
// };

var associationParameter = function (simulator) {
  return ((1 - simulator.solventFraction) * (2.6 - 1.9)) + 1.9;
};

var averageMolarVolume = function (simulator) {
  var averageMolarVolume = 0;
  for (var i in simulator.compounds) {
    averageMolarVolume += simulator.compounds[i].molarVolume;
  }
  return averageMolarVolume /= simulator.compounds.length;
};

/*
Calculate backpressure (in pascals) (Darcy equation)
See Thompson, J. D.; Carr, P. W. Anal. Chem. 2002, 74, 4150-4159.
Backpressure in units of Pa
*/
var backpressure = function (simulator) {
  var velocity = simulator.openTubeFlowVelocity / 100;
  var length = simulator.column.length / 1000;
  var viscosity = simulator.eluentViscosity / 1000;
  var porosity = simulator.column.interparticlePorosity;
  var particleSize = simulator.column.particleSize / 1000000;

  var numerator = velocity * length * viscosity * 180 * Math.pow(1 - porosity, 2);
  var denominator = Math.pow(porosity, 3) * Math.pow(particleSize, 2);

  return numerator / denominator;
};

var chromatographicFlowVelocity = function (simulator) {
  return simulator.openTubeFlowVelocity / simulator.column.totalPorosity;
};

/*
Calculate the average diffusion coefficient using Wilke-Chang
empirical determination. See Wilke, C. R.; Chang, P. AICHE J. 1955, 1,
264-270.

http://onlinelibrary.wiley.com/doi/10.1002/aic.690010222/pdf
*/
var diffusionCoefficient = function (simulator) {
  var x = associationParameter(simulator);
  var M = solventMolecularWeight(simulator);
  var T = kelvin(simulator.temperature);
  var n = simulator.eluentViscosity;
  var v = averageMolarVolume(simulator);
  
  var numer = Math.pow(x * M, 0.5) * T;
  var denom = n * Math.pow(v, 0.6);
  return 7.4e-8 * (numer / denom);
};

/* units: minutes */
var dwellTime = function (simulator) {
  return (simulator.dwellVolume / 1000) / simulator.flowRate;
};

/* units: uL */
var dwellVolume = function (simulator) {
  return simulator.mixingVolume + simulator.nonMixingVolume;
};

/*
This formula is for acetonitrile/water mixtures:
See Chen, H.; Horvath, C. Analytical Methods and Instrumentation. 1993, 1, 213-222.
http://www.speciation.net/Database/Journals/Analytical-Methods-and-Instrumentation-;i289

This formula is for methanol/water mixtures:
Based on fit of data (at 1 bar) in Journal of Chromatography A, 1210 (2008) 30-44.

The formula is the same in both mixtures, but input values vary.
*/

var eluentViscosity = function (simulator) {
  var fraction = simulator.solventFraction;
  var param = simulator.secondarySolvent.eluentViscosityParameters;
  var k = kelvin(simulator.temperature);
  return Math.exp((fraction * (param.a + (param.b / k))) + ((1 - fraction) * (param.c + (param.d / k))) + (fraction * (1 - fraction) * (param.e + (param.f / k))));
};

var hetp = function (simulator) {
  return simulator.column.particleSize / 10000 * simulator.reducedPlateHeight;
};

var interstitialFlowVelocity = function (simulator) {
  return simulator.openTubeFlowVelocity / simulator.column.interparticlePorosity;
};

var kelvin = function (temperature) {
  return temperature + 273.15;
};

/* units: cm/sec */
var openTubeFlowVelocity = function (simulator) {
  return (simulator.flowRate / 60) / simulator.column.area * 100;
};

var postTubingVolume = function (simulator) {
  var length = simulator.postTubingLength / 100;
  var radius = (simulator.postTubingDiameter * 2.54e-5) / 2;
  var area = Math.PI * Math.pow(radius, 2);
  
  return length * (area * 1e9);
};

var reducedFlowVelocity = function (simulator) {
  return ((simulator.column.particleSize / 10000) * simulator.interstitialFlowVelocity) / diffusionCoefficient(simulator);
};

var reducedPlateHeight = function (simulator) {
  var column = simulator.column;
  return column.vanDeemterA + (column.vanDeemterB / simulator.reducedFlowVelocity) + (column.vanDeemterC * simulator.reducedFlowVelocity);
};

var solventMolecularWeight = function (simulator) {
  return (simulator.solventFraction * (simulator.secondarySolvent.molecularWeight - 18)) + 18;
};

var theoreticalPlates = function (simulator) {
  return simulator.column.length / 10 / simulator.hetp;
};

/* units: seconds */
var voidTime = function (simulator) {
  return simulator.column.voidVolume / simulator.flowRate * 60;
};
