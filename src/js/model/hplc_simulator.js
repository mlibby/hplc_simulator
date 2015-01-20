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
    new Compound('3-phenyl propanol', this.secondarySolvent.name),
    new Compound('acetophenone', this.secondarySolvent.name),
    new Compound('p-chlorophenol', this.secondarySolvent.name),
    new Compound('p-nitrotoluene', this.secondarySolvent.name)
  ];

  Object.defineProperty(this, 'compounds', {
    get: function() { return compounds; }
  });

  this.update();
};

Simulator.prototype.update = function () {
  this.voidTime = voidTime(this);
  this.openTubeFlowVelocity = openTubeFlowVelocity(this);
  this.chromatographicFlowVelocity = chromatographicFlowVelocity(this);
  this.interstitialFlowVelocity = interstitialFlowVelocity(this);
  this.eluentViscosity = eluentViscosity(this);
  this.diffusionCoefficient = diffusionCoefficient(this);
  this.reducedFlowVelocity = reducedFlowVelocity(this);
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

var chromatographicFlowVelocity = function (simulator) {
  return simulator.openTubeFlowVelocity / simulator.column.totalPorosity;
};

var diffusionCoefficient = function (simulator) {
  var assocParam = associationParameter(simulator);
  var smw = solventMolecularWeight(simulator);
  var k = kelvin(simulator.temperature);
  var avgMolarVol = averageMolarVolume(simulator);
  var numerator = 0.000000074 * (Math.pow(assocParam * smw, 0.5) * k);
  var denominator = simulator.eluentViscosity * Math.pow(avgMolarVol, 0.6);
  return numerator / denominator;
};

var eluentViscosity = function (simulator) {
  var fraction = simulator.solventFraction;
  var param = simulator.secondarySolvent.eluentViscosityParameters;
  var k = kelvin(simulator.temperature);
  return Math.exp((fraction * (param.a + (param.b / k))) + ((1 - fraction) * (param.c + (param.d / k))) + (fraction * (1 - fraction) * (param.e + (param.f / k))));
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

var reducedFlowVelocity = function (simulator) {
  return ((simulator.column.particleSize / 10000) * simulator.interstitialFlowVelocity) / diffusionCoefficient(simulator);
};

var solventMolecularWeight = function (simulator) {
  return (simulator.solventFraction * (simulator.secondarySolvent.molecularWeight - 18)) + 18;
};

/* units: seconds */
var voidTime = function (simulator) {
  return simulator.column.voidVolume / simulator.flowRate * 60;
};
