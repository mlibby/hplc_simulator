var fs = require('fs');
var ejs = require('ejs');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.set('views', 'dist/html');
app.engine('html', ejs.renderFile);

app.use('/css', express.static('dist/css'));
app.use('/html', express.static('dist/html'));
app.use('/img', express.static('dist/img'));
app.use('/js', express.static('dist/js'));

app.all('*', function(request, response) {
    response.render('index.html');
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
