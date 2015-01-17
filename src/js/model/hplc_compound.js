var HPLC = window.HPLC || {};
window.HPLC = HPLC;

HPLC.Compound = function (compoundName, solventName) {
  var compound =  HPLC.CompoundProperties[compoundName];
  var properties = compound[solventName];
  this.name = compoundName;
  this.logKwTslope = properties.logKwTslope;
  this.logKwTintercept = properties.logKwTintercept;
  this.sTslope = properties.sTslope;
  this.sTintercept = properties.sTintercept;
  this.molarVolume = compound.molarVolume;
};

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

HPLC.CompoundProperties = {
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
};
