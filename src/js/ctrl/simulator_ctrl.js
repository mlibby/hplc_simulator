var HPLC = require("../model/hplc").hplc;

angular
  .module('hplcSimulator')
  .controller('SimulatorCtrl', [ SimulatorCtrl ]);

function SimulatorCtrl($rootScope, $scope) {
  this.simulator = new HPLC.Simulator();
  this.selectedTab = 0;
  this.drawChart();
};

SimulatorCtrl.prototype.primarySolvents = function() {
  return HPLC.primarySolvents;
};

SimulatorCtrl.prototype.secondarySolvents = function() {
  return HPLC.secondarySolvents;
};

SimulatorCtrl.prototype.elutionModes = function() {
  return HPLC.elutionModes;
};

SimulatorCtrl.prototype.nextTab = function() {
  if(this.selectedTab < 5) {
    this.selectedTab += 1;
  }
};

SimulatorCtrl.prototype.previousTab = function() {
  if(this.selectedTab > 0) {
    this.selectedTab -= 1;
  }
};

SimulatorCtrl.prototype.drawChart = function () {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 480 + margin.left, // + margin.right,
  height = 480; // + margin.top + margin.bottom;
  
  var data = [];
  for(var i = 1; i <= 480; i++) {
    data.push( [1/i, 1/i] );
  }
  
  var x = d3.scale.linear().domain([0, 1]).range([0, 480]);
  
  var y = d3.scale.linear().domain([1, 0]).range([0, 480]);
  
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  
  var yAxis = d3.svg.axis().scale(y).orient("left");
  
  var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });
  
  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .call(yAxis);

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .attr("d", line);
};
