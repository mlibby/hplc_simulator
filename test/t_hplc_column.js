describe('HPLC.Column', function() {
  var column;
  
  beforeEach(function () {
    column = new HPLC.Column('Agilent Zorbax SB-C18');
  });
  
  it('preset column Agilent Zorbax SB-C18 exists', function() {
    expect(column).toNotBe(undefined);
    expect(column.length).toBe(100.0);
    expect(column.diameter).toBe(4.6);
    expect(column.particleSize).toBe(3.0);
    expect(column.interparticlePorosity).toBe(0.4);
    expect(column.intraparticlePorosity).toBe(0.4);
    expect(column.vanDeemterA).toBe(1.0);
    expect(column.vanDeemterB).toBe(5.0);
    expect(column.vanDeemterC).toBe(0.05);
  });

  it('calculates certain properties at initialization', function() {
    var radius = column.diameter / 20;
    expect(column.radius).toEqual(radius);

    var area = Math.PI * Math.pow(radius, 2);
    expect(column.area).toEqual(area);

    var totalPorosity = column.interparticlePorosity + column.intraparticlePorosity * (1 - column.interparticlePorosity);
    expect(column.totalPorosity).toEqual(totalPorosity);
  });

  it('changing the local column does not change the preset', function() {
    var column = new HPLC.Column('Agilent Zorbax SB-C18');
    var presetLength = column.length;
    column.length = 123.4;

    var preset = new HPLC.Column('Agilent Zorbax SB-C18');
    expect(preset.length).toEqual(presetLength);
  });
  
});
