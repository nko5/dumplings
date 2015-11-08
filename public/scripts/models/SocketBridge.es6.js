import Item from './Item';
import Player from './Player';
import Message from '../message';
import Settings from '../config';

export default class SocketBridge {
    game = null;
    io = null;

    constructor(game) {
        this.game = game;
        this.io = io();

        this.setup();
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
                if (opponentJSON === null) {
                    // Sometimes, from server we get null object.
                    return;
                }

                if (opponentJSON.id === this.game.player.id) {
                    // console.log('[?] ignore creates the same user (%s)', playerJSON.id);
                    return;
                }

                // console.log('opponentJSON (%s, %s)', opponentJSON.x, opponentJSON.y);

                this.game.opponents[opponentJSON.id] = Player.create(this.game, opponentJSON);
            });

            items.forEach((itemJSON) => {
                if (this.game.items.isExists(itemJSON.id)) {
                    // Ignore another clients items.
                    return;
                }

                this.game.items.add(Item.create(this.game, itemJSON));
                this.game.board.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
            });
        });

        this.io.on('player:remove', (playerJSON) => {
            let opponent = this.game.opponents[playerJSON.id];

            if (!opponent) {
                // Not yet created (rendered).
                console.log('[?] try remove but, not yet created (%s)', playerJSON.id);
                return;
            }

            opponent.destroy();
            delete this.game.opponents[playerJSON.id];
        });

        this.io.on('player:move', (playerJSON) => {
            if (playerJSON.id === this.game.player.id) {
                // The same player. Ignore it.
                // console.log('[?] ignore my moves (%s)', playerJSON.id);
                return;
            }

            let opponent = this.game.opponents[playerJSON.id];

            if (!opponent) {
                // Not yet created (rendered).
                console.log('[?] try move but, not yet created (%s)', playerJSON.id);
                return;
            }

            this.game.opponents[playerJSON.id].x = playerJSON.x;
            this.game.opponents[playerJSON.id].y = playerJSON.y;
        });

        this.io.on('connect', () => {
            console.log('[$] socket: connect');
        });

        this.io.on('disconnect', () => {
            console.log('[$] socket: disconnect');

            new Message(this.game, {
                message: 'ERROR: Please reload game',
                type: 'error',
                callback: () => {
                    window.location.reload();
                }
            });
        });

        this.io.on('item:new', (itemJSON) => {
            if (this.game.items.isExists(itemJSON.id)) {
                // Ignore another clients items.
                return;
            }

            this.game.items.add(Item.create(this.game, itemJSON));
            this.game.board.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
        });

        this.io.on('item:remove', (itemID) => {
            // console.log('[>] remove item', { id: itemID });

            this.game.items.forEach((item) => {
                if (item.id === itemID) {
                    item.destroy();
                }
            });

            this.game.board.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
        });
    }
}
