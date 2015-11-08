import Item from './Item';
import Player from './Player';
import Message from '../message';

export default class SocketBridge {
    game = null;
    io = null;

    constructor(game) {
        this.game = game;
        this.io = io();

        this.setup();
    }

    setup() {
        this.io.on('player:new', (playerJSON, opponents) => {
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

        this.io.emit('player:new', this.game.player.toJSON());

        this.io.on('connect', () => {
            console.log('[$] socket: connect');
        });

        this.io.on('disconnect', () => {
            console.log('[$] socket: disconnect');

            // Disable keyboard
            this.game.input.enabled = false;

            new Message('ERR: Please reload app', () => {
                window.location.reload();
            });
        });

        this.io.on('items:new', (list) => {
            console.log('[>] new parts of items');

            list.forEach((itemJSON) => {
                // console.log('try to add new item', itemJSON);
                Item.create(this.game, itemJSON);
            });
        });
    }
}
