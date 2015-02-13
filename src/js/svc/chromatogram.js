angular
  .module('hplcSimulator')
  .service('chromatogram', [ Chromatogram ]);

function Chromatogram() {
};

Chromatogram.prototype.highlight = function (compoundName, highlight) {
  var selector = '.line.' + classFromName(compoundName);
  d3.select(selector).classed({'highlight': highlight});
};

/*
  simulator = an instance of Simulator
  selector = a css selector for the chart 'container'
*/
Chromatogram.prototype.draw = function (simulator, selector) {
  var data = buildData(simulator);

  var chartContainer = d3.select(selector);
  if(chartContainer[0] == null) {
    return;
  }
  
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

  /*
    See http://colorbrewer2.org/
    for information about color choices
  */
  var colorIndex = Math.min(11, Math.max(3, simulator.compounds.length));
  var colors = d3.scale.ordinal()
    .range(colorbrewer.Paired[12]); //simulator.compounds.length]);

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

  var orderByMax = function (data) {
    var maxes = {};
    for(var i = 0; i < data.length; i++) {
      var max = Math.max.apply(null, data[i].map(function (d) { return d[1]; }));
      maxes[max] = maxes[max] || [];
      maxes[max].push(i);
    }
    console.log(maxes);
    var sortedKeys = Object.keys(maxes).sort();
    console.log(sortedKeys);
    return sortedKeys.map(function (k) { return maxes[k]; });
  };
  
  var stack = d3.layout.stack()
    .offset('zero')
    .order(orderByMax)
    .values(function (d) { return d.values; });

  var layers = stack(data);
  
  var area = d3.svg.area()
    .interpolate('monotone')
    .x(function (d, i) { return x(i); })
    .y0(function (d) { return y(d.y0); })
    .y1(function (d) { return y(d.y0 + d.y); });

  svg.selectAll('.layer')
    .data(layers)
    .enter().append('path')
    .attr('class', 'layer')
    .attr('d', function (d) { return area(d.values); })
    .style('fill', function (d, i) { return colors(i); });
};

var allCompoundSeries = function (dataSet) {
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
      series[v] += ds.values[v].y;
    }
  }
  return series;
};

var buildData = function (simulator) {
  var data = [];
  for(var i = 0; i < simulator.compounds.length; i++) {
    var compound = simulator.compounds[i];
    var values = simulator.getCompoundSeries(compound)
        .map(function (e, i) {
          return {x: i, y: e, y0: 0};
        });
    data.push({
      type: 'compound',
      label: compound.name,
      values: values,
    });
  }

  return data;
};

var classFromName = function (name) {
  return name.toLowerCase().replace(/[^a-z]/ig, '');
};

var formatTime = function (d) {
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

