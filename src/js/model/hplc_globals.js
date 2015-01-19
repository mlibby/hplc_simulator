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
      eluentViscosity: function (solventFraction, tempKelvin) {
        return Math.exp((solventFraction * (-3.476 + (726 / tempKelvin))) + ((1 - solventFraction) * (-5.414 + (1566 / tempKelvin))) + (solventFraction * (1 - solventFraction) * (-1.762 + (929 / tempKelvin))));
      },
    },
    methanol: {
      name: 'Methanol',
      molecularWeight: 32,
      eluentViscosity: function (solventFraction, tempKelvin) {
        return Math.exp((solventFraction * (-4.597 + (1211 / tempKelvin))) + ((1 - solventFraction) * (-5.961 + (1736 / tempKelvin))) + (solventFraction * (1 - solventFraction) * (-6.215 + (2809 / tempKelvin))));
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
