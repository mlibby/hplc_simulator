describe('HPLC.Compound', function () {

  it('can get phenol in acetonitrile', function() {
    var phenol = new HPLC.Compound('phenol', HPLC.secondarySolvents.acetonitrile.name);
    expect(phenol).not.toBe(null);
    expect(phenol.name).toBe("phenol");
    expect(phenol.logKwTslope).toBe(-0.007051397);
    expect(phenol.logKwTintercept).toBe(1.222652803);
    expect(phenol.sTslope).toBe(0.004948239);
    expect(phenol.sTintercept).toBe(-2.157819856);
  });

  it('can get phenol in methanol', function() {
    var phenol = new HPLC.Compound('phenol', HPLC.secondarySolvents.methanol.name);
    expect(phenol).not.toBe(null);
    expect(phenol.name).toBe("phenol");
    expect(phenol.logKwTslope).toBe(-0.010465);
    expect(phenol.logKwTintercept).toBe(1.714002);
    expect(phenol.sTslope).toBe(0.009040);
    expect(phenol.sTintercept).toBe(-2.668850);
  });

  it('can calculate retention factor (k prime)', function () {
    var phenol = new HPLC.Compound('phenol', HPLC.secondarySolvents.acetonitrile.name);
    expect(phenol.kprime(0.5, 25)).toBeAround(1.06982055);
  });
  
});
