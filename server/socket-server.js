var uuid = require('node-uuid');
var _ = require('underscore');
var Settings = require('./config');
var availableItems = require('./defaults-items-positions.json');
var Localization = require('../public/locale/en.json');

availableItems.forEach((o) => {
    o.id = uuid.v4();
});

function randomInteger(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = function (io) {
    var clients = [];
    var items = [];
    var isStarted = false;

    function setPlayerClient(index, player) {
        var currentPlayer = clients[index].player;

        if (currentPlayer && currentPlayer.id !== player.id) {
            throw new Error('ERROR: try to overwrite another player');
        }

        clients[index].player = player;
    }

    function getConnectedClients() {
        return _.filter(clients, function (client) {
            return client.connected;
        });
    }

    function getConnectedPlayers() {
        var connectedClients = getConnectedClients();

        var players = _.reject(connectedClients, function (client) {
            return client.player === undefined;
        });

        return players.map(function (client) {
            if (!client.player) {
                console.log('ERROR: Player is undefined', client.player);
                process.exit(1);
            }
            return client.player;
        });
    }

    function clearPlayersScore() {
        clients.forEach(function (client) {
            if (client.connected && client.player) {
                client.player.score = 0;

                io.emit('player:score', client.player);
            }
        });
    }

    function calculateResults() {
        var list = [];

        clients.forEach(function (client) {
            if (client.connected && client.player) {
                list.push({
                    id: client.player.id,
                    name: client.player.name,
                    score: client.player.score,
                    message: 'Game Over'
                });
            }
        });

        list = _.sortBy(list, (item) => item.score);

        list.reverse();

        // For many players get only first
        if (list.length > 1) {
            // Only winner has another message
            if (list[0].score > list[1].score) {
                list[0].message = Localization.WINNER;
            }
        } else {
            // If only one player played - he is winner
            list[0].message = Localization.SINGLE_WINNER;
        }

        return list;
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

    var ItemsClock = (function () {
        var addItemsClock = null;
        var removeItemsClock = null;

        return {
            start: function () {
                addItemsClock = setInterval(function () {
                    sendRandomItem();
                }, Settings.INTERVAL_ITEMS_APPEAR);

                removeItemsClock = setInterval(function () {
                    hideRandomItem();
                }, Settings.INTERVAL_ITEMS_DISAPPEAR);
            },

            stop: function () {
                clearInterval(addItemsClock);
                clearInterval(removeItemsClock);
            }
        };
    }());

    function startRound(label, callback) {
        isStarted = true;

        console.log('start round (from "%s")', label);

        var tick = 0;

        var clock = setInterval(() => {
            var remaining = Settings.ROUND_TIME - tick;

            // console.log('socket emit: round:tick');
            io.emit('round:tick', remaining);

            tick++;

            // Wait a second when '00:00'
            if (tick === Settings.ROUND_TIME + 1) {
                clearInterval(clock);

                callback();
            }
        }, 1000);
    }

    function endRound() {
        isStarted = false;
        ItemsClock.stop();

        console.log('[$] socket emit: round:end');
        io.emit('round:end', calculateResults());
    }

    io.on('connection', function (socket) {
        var length = clients.push(socket);

        console.log('[$] socket: connection (%d)', getConnectedPlayers().length);

        io.emit('round:status', isStarted, { id: socket.id });

        socket.on('player:new', function (player) {
            setPlayerClient(length - 1, player);
            io.emit('player:new', player, getConnectedPlayers(), items);
            // console.log('[$] socket: player:new: "%s"', player.name);
        });

        socket.on('player:move', function (player) {
            setPlayerClient(length - 1, player);
            io.emit('player:move', player);
        });

        socket.on('player:score', function (player) {
            setPlayerClient(length - 1, player);
            io.emit('player:score', player);
        });

        socket.on('item:remove', function (itemID) {
            io.emit('item:remove', itemID);

            var index = _.findIndex(items, { id: itemID });

            if (index === -1) {
                return;
            }

            items.splice(index, 1);
            // console.log('[%] remove item: collect (%s)', items.length);
        });

        socket.on('disconnect', function () {
            var name = 'unknown';

            if (socket.player) {
                io.emit('player:remove', socket.player);
                name = socket.player.name;
            }

            console.log('[$] socket: disconnect (%s)', name);
        });

        socket.on('round:start', function (player) {
            // console.log('[$] socket on: round:start');

            // console.log('[$] socket emit: round:start');
            io.emit('round:start', player);

            ItemsClock.start();

            startRound('round:start', endRound);
        });

        socket.on('round:restart', function () {
            // console.log('[$] socket on: round:restart');

            items = [];

            clearPlayersScore();

            // console.log('[$] socket emit: round:restart');
            io.emit('round:restart', socket.player);

            ItemsClock.start();

            startRound('round:restart', endRound);
        });
    });

    ItemsClock.start();
};
