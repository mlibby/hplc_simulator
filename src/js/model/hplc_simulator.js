'use strict';

var HPLC = require("./hplc_globals.js").globals;
var Column = require("./hplc_column.js").Column;
var Compound = require("./hplc_compound.js").Compound;

exports.Simulator = Simulator;

Object.defineProperty(this, 'autoTimeSpan', {
  get: function() { return autoTimeSpan; },
  set: function(value) { autoTimeSpan = value; this.update(); }
});

function Simulator() {
  var inputs = {
    autoTimeSpan: true,

    elutionMode: HPLC.elutionModes.isocratic,

    /* seconds */
    finalTime: 0,

    /* mL/min */
    flowRate: 2.0,

    /* seconds */
    initialTime: 0,

    /* uL */
    injectionVolume: 5.0,

    /* uL */
    mixingVolume: 200.0,

    noise: 2.0,

    /* uL */
    nonMixingVolume: 200.0,

    plotPoints: 3000,

    /* mm ? */
    postTubingDiameter: 5.0,

    /* cm */
    postTubingLength: 0,

    primarySolvent: HPLC.primarySolvents.water,

    secondPlot: 'No Plot',

    secondarySolvent: HPLC.secondarySolvents.acetonitrile,

    signalOffset: 0,

    /* 0 - 100, use solventFraction to get 0.0 - 1.0 */
    solventPercent: 50,

    /* celsius */
    temperature: 25,

    /* seconds */
    timeConstant: 0.1,

    column: new Column('Agilent Zorbax SB-C18'),
  };

  /* create this.inputName properties to force           */
  /* recalculation of all outputs when an inputs changes */
  var inputNames = Object.getOwnPropertyNames(inputs);
  for(var i in inputNames) {
    (function _defineUpdatingProperty(_this) {
      var inputName = inputNames[i];
      Object.defineProperty(_this, inputName, {
        get: function() { return inputs[inputName]; },
        set: function(value) { inputs[inputName] = value; _this.update(); }
      });
    })(this);
  }
  
  Object.defineProperty(this, 'solventFraction', {
    get: function() { return inputs.solventPercent / 100; },
    set: function(value) { inputs.solventPercent = value * 100; this.update(); }
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

  var gradientStops = [
    {time: 0, percent: 5.0},
    {time: 5, percent: 50}
  ];

  Object.defineProperty(this, 'gradientStops', {
    get: function() { return gradientStops; }
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

Simulator.prototype.kPrime = function (compoundIndex) {
  if(this.elutionMode === HPLC.elutionModes.gradient) {
    return NaN;
  } else {
    var compound = this.compounds[compoundIndex];
    var logkprimew1 = compound.km * this.temperature + compound.kb;
    var s1 = -1 * ((compound.sm * this.temperature) + compound.sb);
    return Math.pow(10, logkprimew1 - (s1 * this.solventFraction));
  }
};

Simulator.prototype.tR = function (compoundIndex) {
  return this.voidTime * (1 + this.kPrime(compoundIndex));
};

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
