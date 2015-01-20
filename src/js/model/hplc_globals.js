exports.globals = {

  primarySolvents: {
    water: {
      name: 'Water',
    }
  },

  secondarySolvents: {
    acetonitrile: {
      name: 'Acetonitrile',
      molecularWeight: 41,
      eluentViscosityParameters: {
        a: -3.476,
        b: 726,
        c: -5.414,
        d: 1566,
        e: -1.762,
        f: 929
      }
    },
    methanol: {
      name: 'Methanol',
      molecularWeight: 32,
      eluentViscosityParameters: {
        a: -4.597,
        b: 1211,
        c: -5.961,
        d: 1736,
        e: -6.215,
        f: 2809
      },
    }
  },

  elutionModes: {
    gradient: 'Gradient',
    isocratic: 'Isocratic'
  },

  secondPlotOptions: [
    { noPlot: { label: 'No Plot', type: 'binary' } },
    { solventFraction: { label: 'Solvent B Fraction', type: 'binary' } },
    { backpressure: { label: 'Backpressure', type: 'binary' } },
    { viscosity: { label: 'Mobile Phase Viscosity', type: 'binary' } },
    { retention: { label: 'Retention', type: 'compound' } },
    { position: { label: 'Position', type: 'compound' } }
  ],
};
