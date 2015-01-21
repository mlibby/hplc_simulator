describe('HPLC.Simulator', function() {

  var simulator;

  beforeEach(function() {
    simulator = new HPLC.Simulator();
  });

  /* Mobile Phase Composition values */

  it('has mobile phase composition defaults', function() {
    expect(simulator.primarySolvent).toBe(HPLC.primarySolvents.water);
    expect(simulator.secondarySolvent).toBe(HPLC.secondarySolvents.acetonitrile);
    expect(simulator.elutionMode).toBe(HPLC.elutionModes.isocratic);
    expect(simulator.solventPercent).toBe(50);
  });

  it('calculates solvent fraction as decimal', function () {
    expect(simulator.solventFraction).toBe(0.5);
  });

  /* Plot Options */

  /* Chromatographic Properties */

  it('has chromatographic defaults', function() {
    expect(simulator.temperature).toBe(25.0);
    expect(simulator.injectionVolume).toBe(5.0);
    expect(simulator.flowRate).toBe(2.0);
  });

  it('calculates open tube flow velocity in cm/sec', function() {
    expect(simulator.openTubeFlowVelocity).toBeAround(0.20057333722986187);
  });

  it('calculates chromatographic flow velocity in cm/sec', function () {
    expect(simulator.chromatographicFlowVelocity).toBeAround(0.31339583942165916);
  })

  it('calculates interstitial flow velocity in cm/sec', function () {
    expect(simulator.interstitialFlowVelocity).toBeAround(0.5014333430746546);
  });

  it('calculates reduced flow velocity (in cm/sec?)', function () {
    expect(simulator.reducedFlowVelocity).toBeAround(12.296792167141993);
  });

  it('calculates the void time in seconds', function () {
    expect(simulator.voidTime).toBeAround(31.908528263980802);
  });

  it('calculates reduced plate height', function () {
    expect(simulator.reducedPlateHeight).toBeAround(2.021449717);
  });

  it('calculates HETP in cm', function () {
    expect(simulator.hetp).toBeAround(.0006064);
  });

  it('calculates theoretical plates', function () {
    expect(simulator.theoreticalPlates).toBeAround(16489.81572567);
  });

  it('calculates backpressure in bar', function () {
    expect(simulator.backpressureBar).toBeAround(173.492806658);
  });

  /* General Properties */

  it('has general defaults', function() {
    expect(simulator.timeConstant).toBe(0.1);
    expect(simulator.signalOffset).toBe(0);
    expect(simulator.noise).toBe(2.0);
    expect(simulator.initialTime).toBe(0);
    expect(simulator.finalTime).toBe(0);
    expect(simulator.autoTimeSpan).toBe(true);
    expect(simulator.plotPoints).toBe(3000);
  });

  it('calculates eluent viscosity in cP', function () {
    expect(simulator.eluentViscosity).toBe(0.7688750173397041);
  });

  it('calculates diffusion coefficient in cm^2/sec', function () {
    expect(simulator.diffusionCoefficient).toBeAround(0.000012233271);
  });

  /* Column Properties */

  it('has the default column', function() {
    var defaultColumn = new HPLC.Column('Agilent Zorbax SB-C18');
    expect(simulator.column.name).toBe('Agilent Zorbax SB-C18');
  });

  /* Other Properties */

  it('has default post-tubing settings', function() {
    expect(simulator.postTubingLength).toBe(0);
    expect(simulator.postTubingDiameter).toBe(5.0);
  });

  it('calculates post-column tubing volume in uL', function () {
    expect(simulator.postTubingVolume).toBe(0);
  });

  /* Compounds */

  it('has default compounds', function() {
    var compounds = [
      new HPLC.Compound('phenol', HPLC.secondarySolvents.acetonitrile.name, 5),
      new HPLC.Compound('3-phenyl propanol', HPLC.secondarySolvents.acetonitrile.name, 25),
      new HPLC.Compound('acetophenone', HPLC.secondarySolvents.acetonitrile.name, 40),
      new HPLC.Compound('p-chlorophenol', HPLC.secondarySolvents.acetonitrile.name, 15),
      new HPLC.Compound('p-nitrotoluene', HPLC.secondarySolvents.acetonitrile.name, 10)
    ];
    expect(simulator.compounds).toEqual(compounds);
  });
});
