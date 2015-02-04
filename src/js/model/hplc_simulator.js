'use strict';

var HPLC = require("./hplc_globals.js").globals;
var Column = require("./hplc_column.js").Column;
var Compound = require("./hplc_compound.js").Compound;
var f = require("./hplc_formulae.js").formulae;

exports.Simulator = Simulator;

function Simulator (updateObserver) {
  this.updateObserver = updateObserver || function () {};
  
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

Simulator.prototype.update = function _update () {
  this.postTubingVolume = f.postTubingVolume(this.postTubingLength, this.postTubingDiameter);

  this.voidTime = f.voidTime(this.column.voidVolume, this.flowRate);

  this.openTubeFlowVelocity = f.openTubeFlowVelocity(this.flowRate, this.column.area);

  this.chromatographicFlowVelocity = f.chromatographicFlowVelocity(this.openTubeFlowVelocity, this.column.totalPorosity);

  this.interstitialFlowVelocity = f.interstitialFlowVelocity(this.openTubeFlowVelocity, this.column.interparticlePorosity);

  this.eluentViscosity = f.eluentViscosity(this.solventFraction, this.secondarySolvent.eluentViscosityParameters, this.temperature);

  this.diffusionCoefficient = f.diffusionCoefficient(this.solventFraction, this.secondarySolvent.molecularWeight, this.temperature, this.eluentViscosity, this.compounds);

  this.reducedFlowVelocity = f.reducedFlowVelocity(this.column.particleSize, this.interstitialFlowVelocity, this.diffusionCoefficient);

  this.reducedPlateHeight = f.reducedPlateHeight(this.column.vanDeemterA, this.column.vanDeemterB, this.column.vanDeemterC, this.reducedFlowVelocity);

  this.backpressure = f.backpressure(this.openTubeFlowVelocity, this.column, this.eluentViscosity);

  this.hetp = f.hetp(this.column.particleSize, this.reducedPlateHeight);

  this.theoreticalPlates = f.theoreticalPlates(this.column.length, this.hetp);

  this.dwellVolume = f.dwellVolume(this.mixingVolume, this.nonMixingVolume);

  this.dwellTime = f.dwellTime(this.dwellVolume, this.flowRate);

  this.updateCompounds();

  if(this.autoTimeSpan) {
    this.finalTime = f.maxRetentionTime(this.compounds) * 1.1;
  }

  this.updateObserver();
};

Simulator.prototype.updateCompounds = function _updateCompounds () {
  for(var i = 0; i < this.compounds.length; i++) {
    var compound = this.compounds[i];
    compound.kPrime = f.kPrime(this.elutionMode, this.temperature, this.solventFraction, compound.km, compound.kb, compound.sm, compound.sb);
    compound.tR = f.tR(this.voidTime, compound.kPrime);
    compound.sigma = f.sigma(compound.tR, this.theoreticalPlates, this.timeConstant, this.injectionVolume, this.flowRate);
    compound.w = f.w(this.injectionVolume, compound.concentration);
  }
};

Simulator.prototype.getCompoundSeries = function _getCompoundSeries (compound) {
  var series = [];
  for(var i = this.initialTime; i < this.finalTime; i++) {
    series.push( this.getCompoundSignal(i, compound) );
  }
  return series;
};

/* units: micromoles/liter */
Simulator.prototype.getCompoundSignal = function _getCompoundSignal (time, compound) {
  var w = compound.w;
  var piRoot = Math.sqrt(2 * Math.PI);
  var sigma = compound.sigma;
  var flowRate = this.flowRate / 60000;
  var timeFactor = -Math.pow(time - compound.tR, 2);
  var sigmaFactor = 2 * Math.pow(compound.sigma, 2);
  var signal = ((w / (piRoot * sigma * flowRate)) * Math.exp(timeFactor / sigmaFactor)) + this.signalOffset;
  return signal;
};
