var HPLC = window.HPLC || {};
window.HPLC = HPLC;

HPLC.primarySolvents = {
  water: {
    name: 'Water',
  }
};

HPLC.secondarySolvents = {
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
};

HPLC.elutionModes = {
  gradient: 'Gradient',
  isocratic: 'Isocratic'
};

HPLC.secondPlotOptions = [
  { noPlot: { label: 'No Plot', type: 'binary' } },
  { solventFraction: { label: 'Solvent B Fraction', type: 'binary' } },
  { backpressure: { label: 'Backpressure', type: 'binary' } },
  { viscosity: { label: 'Mobile Phase Viscosity', type: 'binary' } },
  { retention: { label: 'Retention', type: 'compound' } },
  { position: { label: 'Position', type: 'compound' } }
];

HPLC.Simulator = function () {
  this.primarySolvent = HPLC.primarySolvents.water;
  this.secondarySolvent = HPLC.secondarySolvents.acetonitrile;
  this.elutionMode = HPLC.elutionModes.isocratic;
  this.solventFraction = 50;

  this.temperature = 25.0;
  this.injectionVolume = 5.0;
  this.flowRate = 2.0;

  this.secondPlot = 'No Plot';
  
  this.column = new HPLC.Column('Agilent Zorbax SB-C18');
  
  this.timeConstant = 0.1;
  this.signalOffset = 0;
  this.noise = 2.0;
  this.autoTimeSpan = true;
  this.initialTime = 0;
  this.finalTime = 0;
  this.plotPoints = 3000;

  this.postTubingLength = 0;
  this.postTubingDiameter = 5.0;

  this.compounds = [
    new HPLC.Compound('phenol', this.secondarySolvent.name),
  ];

  this.update();
};

HPLC.Simulator.prototype.update = function () {
  this.column.update();
  this.updateOpenTubeFlowVelocity();
  this.updateChromatographicFlowVelocity();
  this.updateInterstitialFlowVelocity();
  this.updateAssociationParameter();
  this.updateSolventMolecularWeight();
  this.updateTempKelvin();
  this.updateEluentViscosity();
};

// HPLC.Simulator.prototype.update = function () {
//   this. = ;
// };

HPLC.Simulator.prototype.updateEluentViscosity = function () {
  this.eluentViscosity = this.secondarySolvent.eluentViscosity(
    this.solventFraction / 100,
    this.tempKelvin
  );
};

HPLC.Simulator.prototype.updateTempKelvin = function () {
  this.tempKelvin = (this.temperature / 100) + 273.15;
};


HPLC.Simulator.prototype.updateSolventMolecularWeight = function () {
  this.solventBaseMolecularWeight = this.secondarySolvent.molecularWeight;
  this.solventMolecularWeight = (this.solventFraction * (this.solventBaseMolecularWeight - 18)) + 18;;
};

HPLC.Simulator.prototype.updateAssociationParameter = function () {
  this.associationParameter = ((1 - this.solventFraction) * (2.6 - 1.9)) + 1.9;
};

HPLC.Simulator.prototype.updateInterstitialFlowVelocity = function () {
  this.interstitialFlowVelocity = this.openTubeFlowVelocity / this.column.interparticlePorosity;
};

HPLC.Simulator.prototype.updateChromatographicFlowVelocity = function () {
  this.chromatographicFlowVelocity = this.openTubeFlowVelocity / this.column.totalPorosity;
};

HPLC.Simulator.prototype.updateOpenTubeFlowVelocity = function () {
  this.openTubeFlowVelocity = this.flowRate / this.column.area;
};




