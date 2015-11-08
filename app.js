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

function setPlayerClient(index, player) {
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
    return clients.map(function (client) {
        if (client.connected && client.player) {
            // console.log('[~] dump player: %s (%s)', client.player.name, client.player.id);
            return client.player;
        }
    });
}

io.on('connection', function (socket) {
    cleanClients();

    var index = clients.push(socket);

    console.log('[$] socket: connection (%d)', clients.length);

    socket.on('player:new', function (player) {
        setPlayerClient(index, player);

        console.log('[$] socket: player:new: "%s"', player.name);
        io.emit('player:new', player, dumpConnectedPlayers());
    });

    socket.on('player:move', function (player) {
        setPlayerClient(index, player);
        io.emit('player:move', player);
    });

    socket.on('error', function () {
        console.log('[$] socket: error');
    });

    socket.on('disconnect', function () {
        var name = 'unknown';
        cleanClients();

        if (socket.player) {
            io.emit('player:remove', socket.player);
            name = socket.player.name;
        }

        console.log('[$] socket: disconnect (%s)', name);
    });

    socket.on('end', function () {
        console.log('[$] socket: end');
    });

    socket.on('close', function () {
        console.log('[$] socket: close');
    });
});
