var HPLC = window.HPLC || {};
window.HPLC = HPLC;

HPLC.Compound = function (compoundName, solvent) {
  var properties = HPLC.CompoundProperties[compoundName][solvent];
  this.name = compoundName;
  this.logKwTslope = properties.logKwTslope;
  this.logKwTintercept = properties.logKwTintercept;
  this.sTslope = properties.sTslope;
  this.sTintercept = properties.sTintercept;
};

/* New Compound Entry */
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

HPLC.CompoundProperties = {
  phenol: {
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
