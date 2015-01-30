'use strict';

var HPLC = require("./hplc_globals.js").globals;

var associationParameter = function (simulator) {
  // return ((1 - simulator.solventFraction) * (2.6 - 1.9)) + 1.9;
  return ((1 - simulator.solventFraction) * 0.7) + 1.9;
};

var averageMolarVolume = function (simulator) {
  var averageMolarVolume = 0;
  for (var i in simulator.compounds) {
    averageMolarVolume += simulator.compounds[i].molarVolume;
  }
  return averageMolarVolume /= simulator.compounds.length;
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

var kelvin = function (temperature) {
  return temperature + 273.15;
};

var solventMolecularWeight= function (simulator) {
  return (simulator.solventFraction * (simulator.secondarySolvent.molecularWeight - 18)) + 18;
};

exports.formulae = {
  kPrime: function (simulator, compound) {
    if(simulator.elutionMode === HPLC.elutionModes.gradient) {
      return NaN;
    } else {
      var logkprimew1 = compound.km * simulator.temperature + compound.kb;
      var s1 = -1 * ((compound.sm * simulator.temperature) + compound.sb);
      return Math.pow(10, logkprimew1 - (s1 * simulator.solventFraction));
    }
  },

  /* units: seconds */
  tR: function (simulator, compound) {
    return simulator.voidTime * (1 + compound.kPrime);
  },

  sigma: function (simulator, compound) {
    var term1 = Math.pow(compound.tR / Math.sqrt(simulator.theoreticalPlates), 2);
    var term2 = Math.pow(simulator.timeConstant, 2);
    var term3 = Math.pow((simulator.injectionVolume / 1000.0) / (simulator.flowRate / 60.0), 2);
    var figure = term1 + term2 + (1.0/12.0) * term3;

    var sigma = Math.sqrt(figure); // + dTubingTimeBroadening

    return sigma;
  },

  // // Calculate dispersion that will result from extra-column tubing
  // // in cm^2
  // double dTubingZBroadening = (2 * m_dDiffusionCoefficient * this.m_dTubingLength / dTubingOpenTubeVelocity) + ((Math.pow(dTubingRadius, 2) * m_dTubingLength * dTubingOpenTubeVelocity) / (24 * m_dDiffusionCoefficient));

  // // convert to mL^2
  // double dTubingVolumeBroadening = Math.pow(Math.sqrt(dTubingZBroadening) * Math.PI * Math.pow(dTubingRadius, 2), 2);

  // // convert to s^2
  // double dTubingTimeBroadening = Math.pow((Math.sqrt(dTubingVolumeBroadening) / m_dFlowRate) * 60, 2);

  /* units: moles */
  w: function (simulator, compound) {
    return (simulator.injectionVolume / 1000000) * compound.concentration;;
  },

  /*
    Calculate backpressure (in pascals) (Darcy equation)
    See Thompson, J. D.; Carr, P. W. Anal. Chem. 2002, 74, 4150-4159.
    Backpressure in units of Pa
  */
  backpressure: function (simulator) {
    var velocity = simulator.openTubeFlowVelocity / 100;
    var length = simulator.column.length / 1000;
    var viscosity = simulator.eluentViscosity / 1000;
    var porosity = simulator.column.interparticlePorosity;
    var particleSize = simulator.column.particleSize / 1000000;

    var numerator = velocity * length * viscosity * 180 * Math.pow(1 - porosity, 2);
    var denominator = Math.pow(porosity, 3) * Math.pow(particleSize, 2);

    return numerator / denominator;
  },

  chromatographicFlowVelocity: function (simulator) {
    return simulator.openTubeFlowVelocity / simulator.column.totalPorosity;
  },

  diffusionCoefficient: diffusionCoefficient,

  /* units: minutes */
  dwellTime: function (simulator) {
    return (simulator.dwellVolume / 1000) / simulator.flowRate;
  },

  /* units: uL */
  dwellVolume: function (simulator) {
    return simulator.mixingVolume + simulator.nonMixingVolume;
  },

  /*
    This formula is for acetonitrile/water mixtures:
    See Chen, H.; Horvath, C. Analytical Methods and Instrumentation. 1993, 1, 213-222.
    http://www.speciation.net/Database/Journals/Analytical-Methods-and-Instrumentation-;i289

    This formula is for methanol/water mixtures:
    Based on fit of data (at 1 bar) in Journal of Chromatography A, 1210 (2008) 30-44.

    The formula is the same in both mixtures, but input values vary.
  */

  eluentViscosity: function (simulator) {
    var fraction = simulator.solventFraction;
    var param = simulator.secondarySolvent.eluentViscosityParameters;
    var k = kelvin(simulator.temperature);
    return Math.exp((fraction * (param.a + (param.b / k))) + ((1 - fraction) * (param.c + (param.d / k))) + (fraction * (1 - fraction) * (param.e + (param.f / k))));
  },

  finalTime: function (simulator) {
    var maxTr = Math.max.apply(null, simulator.compounds.map(function(x) {return x.tR;}));
    return maxTr * 1.1;
  },

  hetp: function (simulator) {
    return simulator.column.particleSize / 10000 * simulator.reducedPlateHeight;
  },

  interstitialFlowVelocity: function (simulator) {
    return simulator.openTubeFlowVelocity / simulator.column.interparticlePorosity;
  },

  /* units: cm/sec */
  openTubeFlowVelocity: function (simulator) {
    return (simulator.flowRate / 60) / simulator.column.area * 100;
  },

  postTubingVolume: function (simulator) {
    var length = simulator.postTubingLength / 100;
    var radius = (simulator.postTubingDiameter * 2.54e-5) / 2;
    var area = Math.PI * Math.pow(radius, 2);

    return length * (area * 1e9);
  },

  reducedFlowVelocity: function (simulator) {
    return ((simulator.column.particleSize / 10000) * simulator.interstitialFlowVelocity) / diffusionCoefficient(simulator);
  },

  reducedPlateHeight: function (simulator) {
    var column = simulator.column;
    return column.vanDeemterA + (column.vanDeemterB / simulator.reducedFlowVelocity) + (column.vanDeemterC * simulator.reducedFlowVelocity);
  },

  theoreticalPlates: function (simulator) {
    return simulator.column.length / 10 / simulator.hetp;
  },

  /* units: seconds */
  voidTime: function (simulator) {
    return simulator.column.voidVolume / simulator.flowRate * 60;
  },
};
