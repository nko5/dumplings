let _ = require('underscore');

import Item from './item';
import Player from './player';
import Message from '../message';
import Settings from '../config';
import Localization from '../../locale/en.json';

export default class SocketBridge {
    game = null;
    io = null;

    constructor(game) {
        this.game = game;
        this.io = io();
    }

    setup() {
        this.io.emit('player:new', this.game.player.toJSON());

        this.io.on('player:new', (playerJSON, opponents, items) => {
            if (playerJSON.id === this.game.player.id) {
                // The same player. Ignore it.
                this.game.player.id = playerJSON.id;
                // console.log('[?] ignore creates user (the same id)');
            } else {
                // console.log('playerJSON (%s, %s)', playerJSON.x, playerJSON.y);
            }

            opponents.forEach((opponentJSON) => {
                if (opponentJSON.id === this.game.player.id) {
                    // console.log('[?] ignore creates the same user (%s)', playerJSON.id);
                    return;
                }

                // console.log('opponentJSON (%s, %s)', opponentJSON.x, opponentJSON.y);

                this.game.opponents[opponentJSON.id] = Player.create(this.game, opponentJSON);
            });

            items.forEach((itemJSON) => {
                if (_.findWhere(this.game.items, { id: itemJSON.id })) {
                    // Ignore another clients items.
                    return;
                }

                this.game.items.add(Item.create(this.game, itemJSON));
                this.game.helpBoard.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
            });
        });

        this.io.on('player:remove', (opponentJSON) => {
            let opponent = this.game.opponents[opponentJSON.id];

            if (!opponent) {
                // Not yet created (rendered).
                // console.log('[?] try remove but, not yet created (%s)', opponentJSON.id);
                return;
            }

            opponent.destroy();
            delete this.game.opponents[opponentJSON.id];

            this.game.resultsBoard.updatePlayerList();
        });

        this.io.on('player:move', (opponentJSON) => {
            if (opponentJSON.id === this.game.player.id) {
                // The same player. Ignore it.
                // console.log('[?] ignore my moves (%s)', opponentJSON.id);
                return;
            }

            let opponent = this.game.opponents[opponentJSON.id];

            if (!opponent) {
                // Not yet created (rendered).
                // console.log('[?] try move but, not yet created (%s)', opponentJSON.id);
                return;
            }

            this.game.opponents[opponentJSON.id].x = opponentJSON.x;
            this.game.opponents[opponentJSON.id].y = opponentJSON.y;
        });

        this.io.on('player:score', (opponentJSON) => {
            if (opponentJSON.id === this.game.player.id) {
                // The same player. Ignore it.
                // console.log('[?] ignore update score myself (%s)', opponentJSON.id);
                return;
            }

            let opponent = this.game.opponents[opponentJSON.id];

            if (!opponent) {
                // Not yet created (rendered).
                // console.log('[?] try update score but, not yet created (%s)', opponentJSON.id);
                return;
            }

            this.game.opponents[opponentJSON.id].score = opponentJSON.score;

            this.game.resultsBoard.updatePlayerList();
        });

        this.io.on('disconnect', () => {
            // console.log('[$] socket: disconnect');

            let callback = () => {
                window.location.reload();
            };

            new Message(this.game, {
                message: Localization.ERROR,
                type: 'error',
                callback: callback
            });

            // For sure, reload user browser
            setTimeout(callback, 1000);
        });

        this.io.on('item:new', (itemJSON) => {
            if (_.findWhere(this.game.items, { id: itemJSON.id })) {
                // Ignore another clients items.
                return;
            }

            this.game.items.add(Item.create(this.game, itemJSON));
            this.game.helpBoard.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
        });

        this.io.on('item:remove', (itemID) => {
            // console.log('[>] remove item', { id: itemID });

            this.game.items.forEach((item) => {
                if (item.id === itemID) {
                    item.destroy();
                }
            });

            this.game.helpBoard.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
        });

        this.io.on('round:tick', (remaining) => {
            // console.log('socket on: round:tick');
            this.game.helpBoard.updateClockLabel(remaining);
        });

        this.io.on('round:start', (playerJSON) => {
            // console.log('socket on: round:start');
            Message.clear(this.game);
        });

        this.io.on('round:restart', (playerJSON) => {
            // console.log('socket on: round:restart');
            Message.clear(this.game);

            this.game.player.score = 0;

            Object.keys(this.game.opponents).forEach((id) => {
                this.game.opponents[id].score = 0;
            });

            this.game.items.removeAll(true);
            this.game.helpBoard.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);

            this.game.resultsBoard.updatePlayerList();
        });

        this.io.on('round:end', (results) => {
            // console.log('socket on: round:end');

            let player = _.findWhere(results, { id: this.game.player.id });
            let message = null;
            let type = null;

            if (player === undefined) {
                message = Localization.ROUND_START;
            } else {
                message = player.message;
                type = 'info';
            }

            new Message(this.game, {
                message: message,
                type: type,
                callback: () => {
                    // console.log('socket emit: round:restart');
                    this.io.emit('round:restart', this.game.player.toJSON());
                }
            });
        });
    }
}
