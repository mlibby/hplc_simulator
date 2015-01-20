describe('HPLC.Column', function () {
  var column;
  
  beforeEach(function () {
    column = new HPLC.Column('Agilent Zorbax SB-C18');
  });
  
  it('preset column Agilent Zorbax SB-C18 exists', function () {
    expect(column).not.toBe(undefined);
    expect(column.length).toBe(100.0);
    expect(column.diameter).toBe(4.6);
    expect(column.particleSize).toBe(3.0);
    expect(column.interparticlePorosity).toBe(0.4);
    expect(column.intraparticlePorosity).toBe(0.4);
    expect(column.vanDeemterA).toBe(1.0);
    expect(column.vanDeemterB).toBe(5.0);
    expect(column.vanDeemterC).toBe(0.05);
  });
  
  it('calculates the volume in cubic mm', function () {
    var radius_mm = column.diameter / 2;
    var area_mm2 = Math.PI * Math.pow(radius_mm, 2);
    var volume_mm3 = column.length * area_mm2;
    expect(column.volume).toBe(volume_mm3); 
  });
  
  it('calculates total porosity', function () {
    // column.interparticlePorosity + column.intraparticlePorosity * (1 - column.interparticlePorosity);
    expect(column.totalPorosity).toBe(0.64);
  });

  it('calculates the void volume in mL', function () {
    expect(column.voidVolume).toBe(1.06361760879936);
  });

  it('changing the local column does not change the preset', function () {
    var column = new HPLC.Column('Agilent Zorbax SB-C18');
    var presetLength = column.length;
    column.length = 123.4;

    var preset = new HPLC.Column('Agilent Zorbax SB-C18');
    expect(preset.length).toEqual(presetLength);
  });
  
});
