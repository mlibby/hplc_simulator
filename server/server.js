var fs = require('fs');
var ejs = require('ejs');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var prefix = 'dist/dev/';

app.set('views', prefix + 'html');
app.engine('html', ejs.renderFile);

app.use('/css', express.static(prefix + 'css'));
app.use('/html', express.static(prefix + 'html'));
app.use('/img', express.static(prefix + 'img'));
app.use('/js', express.static(prefix + 'js'));

app.all('*', function(request, response) {
    response.render('index.html');
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
