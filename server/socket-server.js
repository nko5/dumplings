module.exports = function (io) {
    var clients = [];

    function setPlayerClient(index, player) {
        clients[index].player = player;
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

        var length = clients.push(socket);

        console.log('[$] socket: connection (%d)', length);

        socket.on('player:new', function (player) {
            setPlayerClient(length - 1, player);

            console.log('[$] socket: player:new: "%s"', player.name);
            io.emit('player:new', player, dumpConnectedPlayers());
        });

        socket.on('player:move', function (player) {
            setPlayerClient(length - 1, player);
            io.emit('player:move', player);
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
    });
};
