'use strict';

var f = require("./hplc_formulae.js").formulae;

exports.Column = Column;

function Column(presetName) {
  /* units: mm */
  var diameter;
  Object.defineProperty(this, 'diameter', {
    get: function() { return diameter; },
    set: function(value) { diameter = value; this.update(); }
  });

  var interparticlePorosity;
  Object.defineProperty(this, 'interparticlePorosity', {
    get: function() { return interparticlePorosity; },
    set: function(value) { interparticlePorosity = value; this.update(); }
  });

  var intraparticlePorosity;
  Object.defineProperty(this, 'intraparticlePorosity', {
    get: function() { return intraparticlePorosity; },
    set: function(value) { intraparticlePorosity = value; this.update(); }
  });

  /* units: mm */
  var length;
  Object.defineProperty(this, 'length', {
    get: function() { return length; },
    set: function(value) { length = value; this.update(); }
  });

  var name;
  Object.defineProperty(this, 'name', {
    get: function() { return name; },
    set: function(value) { name = value; this.update(); }
  });

  /* units: um */
  var particleSize;
  Object.defineProperty(this, 'particleSize', {
    get: function() { return particleSize; },
    set: function(value) { particleSize = value; this.update(); }
  });

  var vanDeemterA;
  Object.defineProperty(this, 'vanDeemterA', {
    get: function() { return vanDeemterA; },
    set: function(value) { vanDeemterA = value; this.update(); }
  });

  var vanDeemterB;
  Object.defineProperty(this, 'vanDeemterB', {
    get: function() { return vanDeemterB; },
    set: function(value) { vanDeemterB = value; this.update(); }
  });

  var vanDeemterC;
  Object.defineProperty(this, 'vanDeemterC', {
    get: function() { return vanDeemterC; },
    set: function(value) { vanDeemterC = value; this.update(); }
  });

  this.applyPreset = function(presetName) {
    var preset = presets[presetName];

    diameter = preset.diameter;
    interparticlePorosity = preset.interparticlePorosity;
    intraparticlePorosity = preset.intraparticlePorosity;
    length = preset.length;
    name = preset.name;
    particleSize = preset.particleSize;
    vanDeemterA = preset.vanDeemterA;
    vanDeemterB = preset.vanDeemterB;
    vanDeemterC = preset.vanDeemterC;

    this.update();
  };

  this.applyPreset('Agilent Zorbax SB-C18');
};

Column.prototype.update = function () {
  this.area = f.area(this);
  this.volume = f.volume(this);
  this.totalPorosity = f.totalPorosity(this);
  this.voidVolume = f.voidVolume(this);
};

var presets = {
  'Agilent Zorbax SB-C18': {
    name: 'Agilent Zorbax SB-C18',
    length: 100.0,
    diameter: 4.6,
    particleSize: 3.0,
    interparticlePorosity: 0.4,
    intraparticlePorosity: 0.4,
    vanDeemterA: 1.0,
    vanDeemterB: 5.0,
    vanDeemterC: 0.05,
  },
};
