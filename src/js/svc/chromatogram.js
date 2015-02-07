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

var buildDataSet = function _buildDataSet (simulator) {
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

  return dataSet;
};

var classFromName = function _classFromName (name) {
  return name.toLowerCase().replace(/[^a-z]/ig, '');
};

var formatTime = function _formatTime (d) {
  var timeParts = [];
  if(d >= 3600) {
    var hours =  Math.floor(d / 3600);
    timeParts.push(hours);
    d -= hours * 3600;
  }

  var minutes = Math.floor(d / 60);
  if(minutes === 60) {
    timeParts.push('00');
  } else if(timeParts.length > 0) {
    minutes = '0' + minutes;
    timeParts.push(minutes.substring(minutes.length - 2));
  } else {
    timeParts.push(minutes);
  }
  d -= minutes * 60;

  var seconds = '0' + d;
  timeParts.push(seconds.substring(seconds.length - 2));
  
  return timeParts.join(':');
};

Chromatogram.prototype.highlight = function (compoundName) {
  if(compoundName === false) {
    d3.selectAll('.line').classed({'highlight': false});
    d3.select('.line.analyte').classed({'no-highlight': false});
  } else {
    var selector = '.line.' + classFromName(compoundName);
    d3.select(selector).classed({'highlight': true});
    d3.select('.line.analyte').classed({'no-highlight': true});
  }
};

/*
  simulator = an instance of Simulator
  selector = a css selector for the chart 'container'
*/
Chromatogram.prototype.draw = function (simulator, selector) {
  var dataSet = buildDataSet(simulator);
  
  var chartContainer = d3.select(selector);
  chartContainer.select('*').remove();
  var svgWidth = chartContainer.style('width').replace(/px$/, '') - 16;
  var svgHeight = svgWidth / 1.77;
  chartContainer.style('height', svgHeight + 'px');
  
  var margin = {top: 20, right: 40, bottom: 50, left: 20},
  width = svgWidth - margin.left - margin.right;
  height = svgHeight - margin.top - margin.bottom;
  
  var x = d3.scale.linear()
    .domain([simulator.initialTime, simulator.finalTime])
    .range([0, width]);
  
  var y = d3.scale.linear()
    .domain([3, 0])
    .range([0, height]);

  var tickInterval = 15;
  var duration = simulator.finalTime - simulator.initialTime;
  var pps = width / duration;
  if (pps < 2) {
    tickInterval = 30;
  }
  if (pps < 1.5) {
    tickInterval = 60;
  }
  if(pps < 0.5) {
    tickInterval = 120;
  }
  if(pps < 0.3) {
    tickInterval = 300;
  }
  if(pps < 0.2) {
    tickInterval = 600;
  }
  if(pps < 0.092) {
    tickInterval = 1800;
  }
  
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(formatTime)
    .tickValues(d3.range(simulator.initialTime, simulator.finalTime, tickInterval));
  
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');
  
  var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });
  
  var svg = chartContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + margin.left + ',' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('transform', 'translate(' + (width / 2 - margin.left) + ',32)')
    .text('time');
  
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
    .call(yAxis);

  var setCount = dataSet.length;
  for(var s = 0; s < setCount; s++) {
    var data = [];
    var series = dataSet[s];
    var length = series.values.length;
    for(var i = 0; i < length; i++) {
      data.push([i, series.values[i]]);
    }
    
    svg.append('path')
      .datum(data)
      .attr('class', 'line ' + classFromName(dataSet[s].label))
      .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
      .attr('d', line);
  }

};
