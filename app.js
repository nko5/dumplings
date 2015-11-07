var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;


// HTTP

app.use(express.static(__dirname + '/public'));

http.listen(port, function () {
    console.log('Listening on *:' + port);
});


// Socket.io

var clients = [];

function appendClients(index, player) {
    clients[index - 1].player = player;
}

function cleanClients() {
    clients.forEach(function (client) {
        if (client.disconnected) {
            clients.splice(clients.indexOf(client), 1);
        }
    });
}

function dumpConnectedPlayers() {
    return clients.forEach(function (client) {
        if (client.connected && client.player) {
            console.log('[~] dump player: %s (%s)', client.player.name, client.player.id);
            return client;
        }
    });
}

io.on('connection', function (socket) {
    cleanClients();

    var index = clients.push(socket);

    console.log('[$] socket: connection (%d)', clients.length);

    socket.on('player:new', function (player) {
        appendClients(index, player);
        dumpConnectedPlayers();

        console.log('[$] socket: player:new: "%s"', player.name);
        io.emit('player:new', player);
    });

    socket.on('player:move', function (player) {
        io.emit('player:move', player);
    });

    io.on('error', function () {
        console.log('[$] socket: error');
    });

    io.on('disconnect', function () {
        console.log('[$] socket: disconnect');
        cleanClients();
    });

    io.on('end', function () {
        console.log('[$] socket: end');
    });

    io.on('close', function () {
        console.log('[$] socket: close');
    });
});
