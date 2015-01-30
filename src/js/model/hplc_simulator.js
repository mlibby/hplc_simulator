'use strict';

var HPLC = require("./hplc_globals.js").globals;
var Column = require("./hplc_column.js").Column;
var Compound = require("./hplc_compound.js").Compound;
var f = require("./hplc_formulae.js").formulae;

exports.Simulator = Simulator;

function Simulator() {
  var inputs = {
    autoTimeSpan: true,

    elutionMode: HPLC.elutionModes.isocratic,
    
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

  /* seconds */
  inputs.finalTime = 0;
  Object.defineProperty(this, 'finalTime', {
    get: function() { return inputs.finalTime; },
    set: function(value) {
      inputs.finalTime = value;
      if(this.autoTimeSpan !== true) {
        this.update();
      } 
    }
  });

  this.update();
};

Simulator.prototype.update = function () {
  this.postTubingVolume = f.postTubingVolume(this);
  this.voidTime = f.voidTime(this);
  this.openTubeFlowVelocity = f.openTubeFlowVelocity(this);
  this.chromatographicFlowVelocity = f.chromatographicFlowVelocity(this);
  this.interstitialFlowVelocity = f.interstitialFlowVelocity(this);
  this.eluentViscosity = f.eluentViscosity(this);
  this.diffusionCoefficient = f.diffusionCoefficient(this);
  this.reducedFlowVelocity = f.reducedFlowVelocity(this);
  this.reducedPlateHeight = f.reducedPlateHeight(this);
  this.backpressure = f.backpressure(this);
  this.hetp = f.hetp(this);
  this.theoreticalPlates = f.theoreticalPlates(this);
  this.dwellVolume = f.dwellVolume(this);
  this.dwellTime = f.dwellTime(this);

  this.updateCompounds();

  if(this.autoTimeSpan) {
    this.finalTime = f.finalTime(this);
  }
};

Simulator.prototype.updateCompounds = function () {
  for(var i = 0; i < this.compounds.length; i++) {
    var compound = this.compounds[i];
    compound.kPrime = f.kPrime(this, compound);
    compound.tR = f.tR(this, compound);
    compound.sigma = f.sigma(this, compound);
    compound.w = f.w(this, compound);
  }
};

