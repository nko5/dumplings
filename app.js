var express = require('express');
var app = express();
var port = 8080;

var env = app.get('env');
console.log(env);

// Create a static file server
app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log('Express server started on port %s', port);
