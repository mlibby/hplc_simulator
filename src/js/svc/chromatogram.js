angular
  .module('hplcSimulator')
  .service('chromatogram', [ Chromatogram ]);

function Chromatogram() {
};

/*
  simulator = an instance of Simulator
  selector = a css selector for the chart "container"
*/
Chromatogram.prototype.draw = function (simulator, selector) {

  var chartContainer = d3.select(selector);
  chartContainer.select('*').remove();
  
  var svgWidth = chartContainer.style("width").replace(/\D/g, '') - 16;
  var svgHeight = svgWidth / 1.78;
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
  width = svgWidth - margin.left - margin.right;
  height = svgHeight - margin.top - margin.bottom;
  
  var data = [];
  for(var i = simulator.initialTime; i < simulator.finalTime; i++) {
    data.push( [i, i/simulator.finalTime] );
  }
  
  var x = d3.scale.linear()
    .domain([simulator.initialTime, simulator.finalTime])
    .range([0, width]);
  
  var y = d3.scale.linear()
    .domain([1, 0])
    .range([0, height]);
  
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
  
  var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });
  
  var svg = chartContainer.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(xAxis)
    .append("text")
    .text("time (seconds)")
  ;
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .call(yAxis)
  ;
  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .attr("d", line);
};
