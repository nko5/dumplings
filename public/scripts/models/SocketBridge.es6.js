import Player from './Player';

export default class SocketBridge {
    game = null;
    io = null;

    constructor(game) {
        this.game = game;
        this.io = io();

        this.setup();
    }

    setup() {
        this.io.on('player:new', (playerJSON, players) => {
            if (playerJSON.id === this.game.player.id) {
                // The same player. Ignore it.
                this.game.player.id = playerJSON.id;
                // console.log('[?] ignore user (the same id)');
            }

            players.forEach((playerJSON) => {
                if (playerJSON === null) {
                    // Sometimes, from server we get null object.
                    return;
                }

                if (playerJSON.id === this.game.player.id) {
                    console.log('[?] ignore the same user (%s)', playerJSON.id);
                    return;
                }

                this.game.opponents[playerJSON.id] = Player.create(this.game, playerJSON);
            });
        });

        this.io.on('player:remove', (playerJSON) => {
            this.game.opponents[playerJSON.id].remove();
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
                console.log('[?] not yet created (%s)', playerJSON.id);
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

        this.io.on('error', () => {
            console.log('[$] socket: error');
        });
    }
}