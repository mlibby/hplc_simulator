'use strict';

var HPLC = require("./hplc_globals.js").globals;

var f = exports.formulae = {};

f.associationParameter = function (solventFraction) {
  // return ((1 - simulator.solventFraction) * (2.6 - 1.9)) + 1.9;
  return ((1 - solventFraction) * 0.7) + 1.9;
};

f.averageMolarVolume = function (compounds) {
  var averageMolarVolume = 0;
  for (var i in compounds) {
    averageMolarVolume += compounds[i].molarVolume;
  }
  return averageMolarVolume /= compounds.length;
};

// // Calculate dispersion that will result from extra-column tubing
// // in cm^2
// double dTubingZBroadening = (2 * m_dDiffusionCoefficient * this.m_dTubingLength / dTubingOpenTubeVelocity) + ((Math.pow(dTubingRadius, 2) * m_dTubingLength * dTubingOpenTubeVelocity) / (24 * m_dDiffusionCoefficient));

// // convert to mL^2
// double dTubingVolumeBroadening = Math.pow(Math.sqrt(dTubingZBroadening) * Math.PI * Math.pow(dTubingRadius, 2), 2);

// // convert to s^2
// double dTubingTimeBroadening = Math.pow((Math.sqrt(dTubingVolumeBroadening) / m_dFlowRate) * 60, 2);

/*
  Calculate backpressure (in pascals) (Darcy equation)
  See Thompson, J. D.; Carr, P. W. Anal. Chem. 2002, 74, 4150-4159.
  Backpressure in units of Pa
*/
f.backpressure = function (openTubeFlowVelocity, column, eluentViscosity) {
  var velocity = openTubeFlowVelocity / 100;
  var length = column.length / 1000;
  var viscosity = eluentViscosity / 1000;
  var porosity = column.interparticlePorosity;
  var particleSize = column.particleSize / 1000000;

  var numerator = velocity * length * viscosity * 180 * Math.pow(1 - porosity, 2);
  var denominator = Math.pow(porosity, 3) * Math.pow(particleSize, 2);

  return numerator / denominator;
};

f.chromatographicFlowVelocity = function (openTubeFlowVelocity, totalPorosity) {
  return openTubeFlowVelocity / totalPorosity;
};

/*
  Calculate the average diffusion coefficient using Wilke-Chang
  empirical determination. See Wilke, C. R.; Chang, P. AICHE J. 1955, 1,
  264-270.

  http://onlinelibrary.wiley.com/doi/10.1002/aic.690010222/pdf
*/
f.diffusionCoefficient = function (solventFraction, solventMolecularWeight, temperature, eluentViscosity, compounds) {
  var x = f.associationParameter(solventFraction);
  var M = f.solventMolecularWeight(solventFraction, solventMolecularWeight);
  var T = f.kelvin(temperature);
  var n = eluentViscosity;
  var v = f.averageMolarVolume(compounds);

  // are any of these hard-coded values specific to primary
  // solvent being water?
  var numer = Math.pow(x * M, 0.5) * T;
  var denom = n * Math.pow(v, 0.6);
  return 7.4e-8 * (numer / denom);
};

/* units: minutes */
f.dwellTime = function (dwellVolume, flowRate) {
  return (dwellVolume / 1000) / flowRate;
};

/* units: uL */
f.dwellVolume = function (mixingVolume, nonMixingVolume) {
  return mixingVolume + nonMixingVolume;
};

/*
  This formula is for acetonitrile/water mixtures:
  See Chen, H.; Horvath, C. Analytical Methods and Instrumentation. 1993, 1, 213-222.
  http://www.speciation.net/Database/Journals/Analytical-Methods-and-Instrumentation-;i289

  This formula is for methanol/water mixtures:
  Based on fit of data (at 1 bar) in Journal of Chromatography A, 1210 (2008) 30-44.

  The formula is the same in both mixtures, but input values vary.
*/

f.eluentViscosity = function (solventFraction, eluentViscosityParameters, temperature) {
  var fraction = solventFraction;
  var param = eluentViscosityParameters;
  var k = f.kelvin(temperature);
  return Math.exp((fraction * (param.a + (param.b / k))) + ((1 - fraction) * (param.c + (param.d / k))) + (fraction * (1 - fraction) * (param.e + (param.f / k))));
};

f.hetp = function (particleSize, reducedPlateHeight) {
  return particleSize / 10000 * reducedPlateHeight;
};

f.interstitialFlowVelocity = function (openTubeFlowVelocity, interparticlePorosity) {
  return openTubeFlowVelocity / interparticlePorosity;
};

f.kelvin = function (celsius) {
  return celsius + 273.15;
};

f.kPrime = function (elutionMode, temperature, solventFraction, km, kb, sm, sb) {
  if(elutionMode === HPLC.elutionModes.gradient) {
    return NaN;
  } else {
    var logkprimew1 = km * temperature + kb;
    var s1 = -1 * ((sm * temperature) + sb);
    return Math.pow(10, logkprimew1 - (s1 * solventFraction));
  }
};

f.maxRetentionTime = function (compounds) {
  return Math.max.apply(null, compounds.map(function(x) {return x.tR;}));
};

/* units: cm/sec */
f.openTubeFlowVelocity = function (flowRate, area) {
  return (flowRate / 60) / area * 100;
};

f.postTubingVolume = function (postTubingLength, postTubingDiameter) {
  var length = postTubingLength / 100;
  var radius = (postTubingDiameter * 2.54e-5) / 2;
  var area = Math.PI * Math.pow(radius, 2);

  return length * (area * 1e9);
};

f.reducedFlowVelocity = function (particleSize, interstitialFlowVelocity, diffusionCoefficient) {
  return ((particleSize / 10000) * interstitialFlowVelocity) / diffusionCoefficient;
};

/* Van Deemter A, B, C */
f.reducedPlateHeight = function (a, b, c, reducedFlowVelocity) {
  return a + (b / reducedFlowVelocity) + (c * reducedFlowVelocity);
};

f.sigma = function _sigma (tR, theoreticalPlates, timeConstant, injectionVolume, flowRate) {
  var term1 = Math.pow(tR / Math.sqrt(theoreticalPlates), 2);
  var term2 = Math.pow(timeConstant, 2);
  var term3 = Math.pow((injectionVolume / 1000.0) / (flowRate / 60.0), 2);
  var figure = term1 + term2 + (1.0/12.0) * term3;

  return Math.sqrt(figure); // + dTubingTimeBroadening
};

f.solventMolecularWeight= function (solventFraction, solventMolecularWeight) {
  return (solventFraction * (solventMolecularWeight - 18)) + 18;
};

/* units: seconds */
f.tR = function (voidTime, kPrime) {
  return voidTime * (1 + kPrime);
};

f.theoreticalPlates = function (length, hetp) {
  return length / 10 / hetp;
};

/* units: seconds */
f.voidTime = function (voidVolume, flowRate) {
  return voidVolume / flowRate * 60;
};

/* units: moles */
f.w = function (injectionVolume, concentration) {
  return (injectionVolume / 1000000) * concentration;;
};
