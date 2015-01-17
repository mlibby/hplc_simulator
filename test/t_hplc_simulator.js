describe('HPLC.Simulator', function() {

  var simulator;

  beforeEach(function() {
    simulator = new HPLC.Simulator();
  });
  
  it('can be instantiated', function() {
    expect(simulator).toNotBe(null);
  });

  it('has mobile phase composition defaults', function() {
    expect(simulator.primarySolvent).toBe(HPLC.primarySolvents.water);
    expect(simulator.secondarySolvent).toBe(HPLC.secondarySolvents.acetonitrile);
    expect(simulator.elutionMode).toBe(HPLC.elutionModes.isocratic);
    expect(simulator.solventFraction).toBe(50);
  });

  it('has chromatographic defaults', function() {
    expect(simulator.degrees).toBe(25.0);
    expect(simulator.injectionVolume).toBe(5.0);
    expect(simulator.flowRate).toBe(2.0);
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
    var phenol = new HPLC.Compound('phenol', HPLC.secondarySolvents.acetonitrile);
    expect(simulator.compounds).toEqual([phenol]);
  });
});
