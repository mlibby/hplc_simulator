describe('HPLC.Simulator', function() {

  var simulator;

  beforeEach(function() {
    simulator = new HPLC.Simulator();
  });
  
  it('has mobile phase composition defaults', function() {
    expect(simulator.primarySolvent).toBe(HPLC.primarySolvents.water);
    expect(simulator.secondarySolvent).toBe(HPLC.secondarySolvents.acetonitrile);
    expect(simulator.elutionMode).toBe(HPLC.elutionModes.isocratic);
    expect(simulator.solventFraction).toBe(50);
  });

  it('has chromatographic defaults', function() {
    expect(simulator.temperature).toBe(25.0);
    expect(simulator.injectionVolume).toBe(5.0);
    expect(simulator.flowRate).toBe(2.0);
  });
  
  it('calculates open tube flow velocity', function() {
    var openTubeFlowVelocity = simulator.flowRate / simulator.column.area;
    expect(simulator.openTubeFlowVelocity).not.toBe(NaN);
    expect(simulator.openTubeFlowVelocity).toBeGreaterThan(0);
    expect(simulator.openTubeFlowVelocity).toEqual(openTubeFlowVelocity);
  });

  it('calculates chromatographic flow velocity', function () {
    var chromatographicFlowVelocity = simulator.openTubeFlowVelocity / simulator.column.totalPorosity;
    expect(simulator.chromatographicFlowVelocity).not.toBe(NaN);
    expect(simulator.chromatographicFlowVelocity).toBeGreaterThan(0);
    expect(simulator.chromatographicFlowVelocity).toEqual(chromatographicFlowVelocity);
  })

  it('calculates interstitial flow velocity', function () {
    var interstitialFlowVelocity = simulator.openTubeFlowVelocity / simulator.column.interparticlePorosity;
    expect(simulator.interstitialFlowVelocity).not.toBe(NaN);
    expect(simulator.interstitialFlowVelocity).toBeGreaterThan(0);
    expect(simulator.interstitialFlowVelocity).toEqual(interstitialFlowVelocity);
  });

  it('calculates association parameter', function () {
    var associationParameter = ((1 - (simulator.solventFraction/100)) * (2.6 - 1.9)) + 1.9;
    expect(simulator.associationParameter).not.toBe(NaN);
    expect(simulator.associationParameter).toBeGreaterThan(0);
    expect(simulator.associationParameter).toEqual(associationParameter);
  });

  it('gets secondary solvent base molecular weight', function() {
    expect(simulator.solventBaseMolecularWeight).toEqual(41);
    simulator.secondarySolvent = HPLC.secondarySolvents.methanol;
    simulator.update();
    expect(simulator.solventBaseMolecularWeight).toEqual(32);
  });

  it('calculates secondary solvent weighted average molecular weight', function () {
    var solventMolecularWeight = ((simulator.solventFraction/100) * (simulator.solventBaseMolecularWeight - 18)) + 18;
    expect(simulator.solventMolecularWeight).toEqual(solventMolecularWeight);
  });

  it('calculates kelvin temp', function () {
    var tempKelvin = (simulator.temperature /100) + 273.15;
    expect(simulator.tempKelvin).toEqual(tempKelvin);
  });

  it('calculates eluent viscosity (for acetonitrile)', function () {
    var solventFraction = simulator.solventFraction / 100;
    var eluentViscosity = Math.exp(
      (solventFraction * (-3.476 + (726 / simulator.tempKelvin))) +
        ((1 - solventFraction) * (-5.414 + (1566 / simulator.tempKelvin))) +
        (solventFraction * (1 - solventFraction) * (-1.762 + (929 / simulator.tempKelvin)))
    );
    expect(simulator.eluentViscosity).toEqual(eluentViscosity);
  });

  it('calculates average molar volume', function () {
    var averageMolarVolume = 0;
    for (var i in simulator.compounds) {
      averageMolarVolume += simulator.compounds[i].molarVolume;
    }
    averageMolarVolume /= simulator.compounds.length;
    expect(simulator.averageMolarVolume).toEqual(averageMolarVolume);
  });

  it('calculates diffusion coefficient', function () {
    var diffusionCoefficient = 0.000000074 * (Math.pow(simulator.associationParameter * simulator.solventMolecularWeight, 0.5) * simulator.tempKelvin) / (simulator.eluentViscosity * Math.pow(simulator.averageMolarVolume, 0.6));
;
    expect(simulator.diffusionCoefficient).toEqual(diffusionCoefficient);
  });

  it('calculates reduced flow velocity', function () {
    var reducedFlowVelocity = ((simulator.column.particleSize / 10000) * simulator.interstitialFlowVelocity) / simulator.diffusionCoefficient;
    expect(simulator.reducedFlowVelocity).toEqual(reducedFlowVelocity);
  });

  it('has general defaults', function() {
    expect(simulator.timeConstant).toBe(0.1);
    expect(simulator.signalOffset).toBe(0);
    expect(simulator.noise).toBe(2.0);
    expect(simulator.initialTime).toBe(0);
    expect(simulator.finalTime).toBe(0);
  });

  it('has the default column', function() {
    var defaultColumn = new HPLC.Column('Agilent Zorbax SB-C18');
    expect(simulator.column.name).toEqual('Agilent Zorbax SB-C18');
  });

  it('has default post-tubing settings', function() {
    expect(simulator.postTubingLength).toEqual(0);
    expect(simulator.postTubingDiameter).toEqual(5.0);
  });

  it('has default compounds', function() {
    var phenol = new HPLC.Compound('phenol', HPLC.secondarySolvents.acetonitrile.name);
    expect(simulator.compounds).toEqual([phenol]);
  });
});
