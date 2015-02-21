var sumData = function (data) {
  var series = [];
  for(var p in data) {
    var d = data[p];

    for(var v in d.values) {
      // start each element with a 0,
      // also protects against data
      // series with different lengths
      while(series.length <= v) {
        series.push(0);
      }
      series[v] += ds.values[v].y;
    }
  }
  return series;
};

var collectData = function (simulator) {
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

