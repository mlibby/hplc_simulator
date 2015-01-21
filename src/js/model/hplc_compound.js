var HPLC = require("./hplc_globals.js");

var Compound = function (compoundName, solventName, concentration) {
  this.name = compoundName;
  this.concentration = concentration;

  var compound =  CompoundProperties[compoundName];
  this.molarVolume = compound.molarVolume;
  
  
  var properties = compound[solventName];
  this.logKwTslope = properties.logKwTslope;
  this.logKwTintercept = properties.logKwTintercept;
  this.sTslope = properties.sTslope;
  this.sTintercept = properties.sTintercept;
};

exports.Compound = Compound;

/* New Compound Entry Template */
// 'compound': {
//   'Acetonitrile': {
//      logKwTslope: ,
//      logKwTintercept: ,
//      sTslope: ,
//      sTintercept:
//   },
//   'Methanol': {
//      logKwTslope: ,
//      logKwTintercept: ,
//      sTslope: ,
//      sTintercept:
//   }
// },

/* TODO: load from database or file */

CompoundProperties = {
  phenol: {
    molarVolume: 103.4,
    'Acetonitrile': {
      logKwTslope: -0.007051397,
      logKwTintercept: 1.222652803,
      sTslope: 0.004948239,
      sTintercept: -2.157819856
    },
    'Methanol': {
      logKwTslope: -0.010465,
      logKwTintercept: 1.714002,
      sTslope: 0.009040,
      sTintercept: -2.668850
    },
  },
  '3-phenyl propanol': {
    molarVolume: 170.0,
    'Acetonitrile': {
      logKwTslope: -0.005175387,
      logKwTintercept: 1.617423196,
      sTslope: 0.004245094,
      sTintercept: -2.711627278
    },
    'Methanol': {
      logKwTslope: -0.012422,
      logKwTintercept: 2.682599,
      sTslope: 0.010667,
      sTintercept: -3.544294
    }
  },
  'acetophenone': {
    molarVolume: 140.4,
    'Acetonitrile': {
      logKwTslope: 0,
      logKwTintercept: 0,
      sTslope: 0,
      sTintercept:0
    },
    'Methanol': {
      logKwTslope: 0,
      logKwTintercept: 0,
      sTslope: 0,
      sTintercept:0
    }
  },
  'p-chlorophenol': {
    molarVolume: 124.3,
    'Acetonitrile': {
      logKwTslope: 0,
      logKwTintercept:0 ,
      sTslope: 0,
      sTintercept:0
    },
    'Methanol': {
      logKwTslope: 0,
      logKwTintercept:0 ,
      sTslope: 0,
      sTintercept:0
    }
  },
  'p-nitrotoluene': {
    molarVolume: 144.9,
    'Acetonitrile': {
      logKwTslope: 0,
      logKwTintercept:0 ,
      sTslope: 0,
      sTintercept:0
    },
    'Methanol': {
      logKwTslope: 0,
      logKwTintercept: 0,
      sTslope: 0,
      sTintercept:0
    }
  },
};
