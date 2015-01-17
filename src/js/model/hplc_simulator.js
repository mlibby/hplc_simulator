var HPLC = window.HPLC || {};
window.HPLC = HPLC;

HPLC.primarySolvents = {
  water: 'Water'
};

HPLC.secondarySolvents = {
  acetonitrile: 'Acetonitrile',
  methanol: 'Methanol'
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

  this.degrees = 25.0;
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
    new HPLC.Compound('phenol', this.secondarySolvent),
  ];

  this.update();
};

HPLC.Simulator.prototype.update = function () {
  this.column.update();
  this.updateOpenTubeFlowVelocity();
  this.updateInjectionVolume();
  this.updateInterstitialFlowVelocity();
};

HPLC.Simulator.prototype.updateInterstitialFlowVelocity = function () {
  this.interstitialFlowVelocity = this.openTubeFlowVelocity / this.column.interparticlePorosity;
};

HPLC.Simulator.prototype.updateInjectionVolume = function () {
  this.chromatographicFlowVelocity = this.openTubeFlowVelocity / this.column.totalPorosity;
};

HPLC.Simulator.prototype.updateOpenTubeFlowVelocity = function () {
  this.openTubeFlowVelocity = this.flowRate / this.column.area;
};




