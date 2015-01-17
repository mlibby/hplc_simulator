var HPLC = HPLC || {};

HPLC.Column = function (presetName) {
  HPLC.ColumnPreset[presetName](this);
  this.update();
};

HPLC.Column.prototype.update = function () {
  this.updateArea();
  this.updateTotalPorosity();
};

HPLC.Column.prototype.updateArea = function () {
  this.radius = (this.diameter / 10) / 2;
  this.area = Math.PI * Math.pow(this.radius, 2);
};

HPLC.Column.prototype.updateTotalPorosity = function () {
  this.totalPorosity = this.interparticlePorosity + this.intraparticlePorosity * (1 - this.interparticlePorosity);
};

HPLC.ColumnPreset = HPLC.ColumnPreset || {};

HPLC.ColumnPreset['Agilent Zorbax SB-C18'] = function(column) {
  column.name = 'Agilent Zorbax SB-C18';
  column.length = 100.0;
  column.diameter = 4.6;
  column.particleSize = 3.0;
  column.interparticlePorosity = 0.4;
  column.intraparticlePorosity = 0.4;
  column.vanDeemterA = 1.0;
  column.vanDeemterB = 5.0;
  column.vanDeemterC = 0.05;
};
