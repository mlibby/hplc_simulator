'use strict';

var HPLC = require("./hplc_globals.js");

/*
log(k')W1 = km * temperature + kb
S = sm * temperature + sb
*/
var Compound = function (compoundName, solventName, concentration) {
  this.name = compoundName;
  this.concentration = concentration;

  var compound =  compoundProperties[compoundName];
  this.mvol = compound.mvol;
  
  var properties = compound[solventName];
  this.km = properties.km;
  this.kb = properties.kb;
  this.sm = properties.sm;
  this.sb = properties.sb;

  Object.defineProperty(this, 'molarVolume', {
    get: function () { return this.mvol; }
  });
};

Compound.prototype.kprime = function (fraction, temperature) {
  var logkprimew1 = this.km * temperature + this.kb;
  var s1 = -1 * ((this.sm * temperature) + this.sb);
  var kprime = Math.pow(10, logkprimew1 - (s1 * fraction));
  return kprime;
};

Compound.prototype.tR = function (elutionMode, fraction, temperature) {
  return 0;
}

exports.Compound = Compound;

/* TODO: load from database or file */
var compoundProperties = {
  'phenol': {
    mvol: 103.4,
    'Acetonitrile': {
      km: -0.007051397,
      kb: 1.222652803,
      sm: 0.004948239,
      sb: -2.157819856
    },
    'Methanol': {
      km: -0.010465,
      kb: 1.714002,
      sm: 0.009040,
      sb: -2.668850
    },
  },
  '3-phenyl propanol': {
    mvol: 170.0,
    'Acetonitrile': {
      km: -0.005175387,
      kb: 1.617423196,
      sm: 0.004245094,
      sb: -2.711627278
    },
    'Methanol': {
      km: -0.012422,
      kb: 2.682599,
      sm: 0.010667,
      sb: -3.544294
    }
  },
  'acetophenone': {
    mvol: 140.4,
    'Acetonitrile': {
      km: -0.006113393,
      kb: 1.615282733,
      sm: 0.004190421,
      sb: -2.419171414
    },
    'Methanol': {
      km: -0.009257,
      kb: 2.098172,
      sm: 0.008684,
      sb: -2.981032
    }
  },
  'p-chlorophenol': {
    mvol: 124.3,
    'Acetonitrile': {
      km: -0.009910541,
      kb: 2.006666967,
      sm: 0.009176534,
      sb: -3.110178571
    },
    'Methanol': {
      km: -0.015142,
      kb: 2.752714,
      sm: 0.013319,
      sb: -3.575982
    }
  },
  'p-nitrotoluene': {
    mvol: 144.9,
    'Acetonitrile': {
      km: -0.010705359,
      kb: 2.565390235,
      sm: 0.009864271,
      sb: -3.433694873
    },
    'Methanol': {
      km: -0.012887,
      kb: 2.900254,
      sm: 0.011005,
      sb: -3.522154
    }
  },
};
