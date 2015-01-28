var fs = require('fs');
var ejs = require('ejs');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var mode = process.env.NODE_ENV || 'prod';
var prefix = 'dist/' + mode + '/';
app.set('views', prefix + 'html');
app.engine('html', ejs.renderFile);

app.use('/css', express.static(prefix + 'css'));
app.use('/html', express.static(prefix + 'html'));
app.use('/img', express.static(prefix + 'img'));
app.use('/js', express.static(prefix + 'js'));

var index = 'index.html';
if(mode === 'prod') {
  var files = fs.readdirSync('dist/prod/html');
  for(var x in files) {
    var f = files[x];
    if(f.match(/index/)) {
      index = f;
    }
  }
}

console.log("Primary index file is " + index);

app.all('*', function(request, response) {
    response.render(index);
});

app.listen(app.get('port'), function() {
    console.log("Node app is running in " + mode + " mode at localhost:" + app.get('port'));
});
