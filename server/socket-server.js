var uuid = require('node-uuid');
var availableItems = require('./defaults-items-positions.json');

availableItems.forEach((o) => {
    o.id = uuid.v4();
});

const SEND_NEW_ITEM_DELAY = 10 * 1000;

function randomInteger(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = function (io) {
    var clients = [];
    var items = [];

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

    function sendRandomItem() {
        var index = randomInteger(0, availableItems.length - 1);
        io.emit('item:new', availableItems[index]);
    }

    setInterval(function () {
        sendRandomItem();
    }, SEND_NEW_ITEM_DELAY);

    io.on('connection', function (socket) {
        cleanClients();

        var length = clients.push(socket);

        console.log('[$] socket: connection (%d)', length);

        socket.on('player:new', function (player) {
            setPlayerClient(length - 1, player);
            io.emit('player:new', player, dumpConnectedPlayers(), items);
            // console.log('[$] socket: player:new: "%s"', player.name);
        });

        socket.on('player:move', function (player) {
            setPlayerClient(length - 1, player);
            io.emit('player:move', player);
        });

        socket.on('item:remove', function (itemID) {
            io.emit('item:remove', itemID);
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
