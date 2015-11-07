var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;


// HTTP

app.use(express.static(__dirname + '/public'));

http.listen(port, function () {
    console.log('listening on *:' + port);
});


// Socket.io

io.on('connection', function (socket) {
    console.log('[+] connection');

    socket.on('new:player', function (player) {
        console.log('[*] new:player', player);
        io.emit('new:player', player);
    });

    io.on('disconnect', function () {
        console.log('[-] disconnect');
    });
});
