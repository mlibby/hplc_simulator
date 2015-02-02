angular
  .module('hplcSimulator')
  .service('chromatogram', [ Chromatogram ]);

function Chromatogram() {
};

var allCompoundSeries = function _allCompoundSeries (dataSet) {
  var series = [];
  for(var p in dataSet) {
    var ds = dataSet[p];
    if(ds.type !== 'compound') {
      break;
    }

    for(var v in ds.values) {
      while(series.length <= v) {
        series.push(0);
      }
      series[v] += ds.values[v];
    }
  }
  return series;
};

/*
  simulator = an instance of Simulator
  selector = a css selector for the chart "container"
*/
Chromatogram.prototype.draw = function (simulator, selector) {
  var dataSet = [];
  for(var i = 0; i < simulator.compounds.length; i++) {
    var compound = simulator.compounds[i];
    dataSet.push({
      type: 'compound',
      label: compound.name,
      values: simulator.getCompoundSeries(compound),
    });
  }

  dataSet.push({
    type: 'analyte',
    label: 'Analyte',
    values: allCompoundSeries(dataSet)
  });

  var chartContainer = d3.select(selector);
  chartContainer.select('*').remove();
  
  var svgWidth = chartContainer.style("width").replace(/\D/g, '') - 16;
  var svgHeight = svgWidth / 1.78;
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
  width = svgWidth - margin.left - margin.right;
  height = svgHeight - margin.top - margin.bottom;
  
  var x = d3.scale.linear()
    .domain([simulator.initialTime, simulator.finalTime])
    .range([0, width]);
  
  var y = d3.scale.linear()
    .domain([3, 0])
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
    .text("time (seconds)");
  
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .call(yAxis);

  var setCount = dataSet.length;
  for(var s = 0; s < setCount; s++) {
    var data = [];
    var series = dataSet[s];
    var length = series.values.length;
    for(var i = 0; i < length; i++) {
      data.push([i, series.values[i]]);
    }
    
    svg.append("path")
      .datum(data)
      .attr("class", "line " + dataSet[s].label.toLowerCase().replace(/[^a-z]/ig, ''))
      .attr("transform", "translate(" + margin.left + "," + 0 + ")")
      .attr("d", line);
  }

};
