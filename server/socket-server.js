var uuid = require('node-uuid');
var Settings = require('./config');
var availableItems = require('./defaults-items-positions.json');

availableItems.forEach((o) => {
    o.id = uuid.v4();
});

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
        var item = availableItems[index];

        if (items.indexOf(item) !== -1) {
            // Ignore existed items.
            return;
        }

        io.emit('item:new', item);
        items.push(availableItems[index]);

        // console.log('[%] send new item (%s)', items.length);
    }

    function hideRandomItem() {
        if (items.length === 0) {
            return;
        }

        var index = randomInteger(0, items.length - 1);
        io.emit('item:remove', items[index].id);

        items.splice(index, 1);
        // console.log('[%] remove item: random (%s)', items.length);
    }

    function findIndex(itemID) {
        var index = -1;

        items.forEach((item, i) => {
            if (item.id === itemID) {
                index = i;
            }
        });

        return index;
    }

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

            var index = findIndex(itemID);

            if (index === -1) {
                return;
            }

            items.splice(index, 1);
            // console.log('[%] remove item: collect (%s)', items.length);
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

        socket.on('round:restart', function () {
            items.forEach((item) => {
                io.emit('item:remove', item.id);
            });

            items = [];
        });
    });

    setInterval(function () {
        sendRandomItem();
    }, Settings.INTERVAL_ITEMS_APPEAR);

    setInterval(function () {
        hideRandomItem();
    }, Settings.INTERVAL_ITEMS_DISAPPEAR);
};
