describe('HPLC.formulae', function() {

  var f;
  
  beforeEach(function() {
    f = HPLC.formulae;
  });

  it('calculates association parameter', function () {
    expect(f.associationParameter(0.5)).toBe(2.25);
  });

  it('calculates average molar value for a set of compounds', function () {
    var compounds = [{molarVolume: 1},{molarVolume: 2.5},{molarVolume: 3.333}];
    expect(f.averageMolarVolume(compounds)).toBeAround(2.2776666);
  });
  
  xit('calculates backpressure in bar', function () {
    expect(simulator.backpressureBar).toBeAround(173.492806658);
  });

  xit('calculates chromatographic flow velocity in cm/sec', function () {
    expect(simulator.chromatographicFlowVelocity).toBeAround(0.31339583942165916);
  })

  it('calculates diffusion coefficient in cm^2/sec', function () {
    var compounds = [{molarVolume: 1},{molarVolume: 2.5},{molarVolume: 3.333}];
    var diffCoeff = f.diffusionCoefficient(0.5, 123, 50, 0.75, compounds);
    expect(diffCoeff).toBeAround(0.000245056565);
  });

  xit('calculates dwell volume and time', function () {
    simulator.elutionMode = HPLC.elutionModes.gradient;
    expect(simulator.dwellVolume).toBe(400.0);
    expect(simulator.dwellTime).toBe(0.20);
  });

  xit('calculates eluent viscosity in cP', function () {
    expect(simulator.eluentViscosity).toBe(0.7688750173397041);
  });

  xit('calculates final time with autotime is on', function () {
    expect(simulator.finalTime).toBeAround(212.7274807);
  });

  xit('calculates HETP in cm', function () {
    expect(simulator.hetp).toBeAround(.0006064);
  });

  xit('calculates interstitial flow velocity in cm/sec', function () {
    expect(simulator.interstitialFlowVelocity).toBeAround(0.5014333430746546);
  });

  it('calculates kelvin from celsius', function () {
    expect(f.kelvin(0)).toBe(273.15);
    expect(f.kelvin(50)).toBe(323.15);
    expect(f.kelvin(100)).toBe(373.15);
  });

  xit('calculates molecular weight (in pmol) for a compound', function () {
    expect(simulator.compounds[0].w).toBeAround(0.000025);
  });

  xit('calculates open tube flow velocity in cm/sec', function() {
    expect(simulator.openTubeFlowVelocity).toBeAround(0.20057333722986187);
  });

  xit('calculates post-column tubing volume in uL', function () {
    expect(simulator.postTubingVolume).toBe(0);
  });

  xit('calculates reduced flow velocity (in cm/sec?)', function () {
    expect(simulator.reducedFlowVelocity).toBeAround(12.296792167141993);
  });

  xit('calculates reduced plate height', function () {
    expect(simulator.reducedPlateHeight).toBeAround(2.021449717);
  });

  xit('returns NaN for retention factor for a compound in gradient mode', function () {
    simulator.elutionMode = HPLC.elutionModes.gradient;
    expect(simulator.compounds[0].kPrime).toEqual(NaN);
  });

  xit('calculates retention factor (k prime) for a compound in isocratic mode', function () {
    expect(simulator.compounds[0].kPrime).toBeAround(1.06982055);
  });

  xit('calculates retention time (tR) for a compound in gradient mode', function () {
    simulator.elutionMode = HPLC.elutionModes.gradient;
    expect(simulator.compounds[0].tR).toBeAround(195.0360);
  });

  xit('calculates retention time (tR) for a compound in isocratic mode', function () {
    expect(simulator.compounds[0].tR).toBeAround(66.0449276);
  });

  xit('calculates sigma for a compound in gradient mode', function () {
    simulator.elutionMode = HPLC.elutionModes.gradient;
    expect(simulator.compounds[0].sigma).toBeAround(1.0092);
  });

  xit('calculates sigma for a compound in isocratic mode', function () {
    expect(simulator.compounds[0].sigma).toBeAround(0.5257354);
  });

  it('calculates solvent molecular weight', function () {
    var smw = f.solventMolecularWeight(0.5, 123);
    expect(smw).toBe(70.5);
  });
  
  xit('calculates theoretical plates', function () {
    expect(simulator.theoreticalPlates).toBeAround(16489.81572567);
  });

  xit('calculates void time in seconds', function () {
    expect(simulator.voidTime).toBeAround(31.908528263980802);
  });

});
