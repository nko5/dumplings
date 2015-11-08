import Board from '../models/Board';
import Player from '../models/Player';
import AbstractState from './AbstractState';
import Message from '../message';

export default class HelloState extends AbstractState {
    init(options) {
        this.name = options.name;
    }

    preload() {
        this.load.image('congruent_outline', 'assets/images/congruent_outline.png');
        this.load.image('footer_lodyas', 'assets/images/footer_lodyas.png');
        this.load.json('positions-1', 'assets/items/positions-1.json');

        this.load.spritesheet('gameboy-tileset', 'assets/tilesets/gameboy-tileset.png', 16, 16);
        this.load.tilemap('map-1', 'assets/maps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.atlasJSONHash('mms', 'assets/sprites/mms.png', 'assets/sprites/mms.json');
    }

    create() {
        this.game.stage.backgroundColor = 'rgba(0, 0, 0, 1)';

        this.displayClick(() => {
            this.game.board = new Board(this.game);

            this.game.opponents = {};
            this.game.player = new Player(this.game, {
                name: this.name
            });

            this.game.socket = io();

            function buildPlayer(game, playerJSON) {
                let player = new Player(game, {
                    id: playerJSON.id,
                    name: playerJSON.name,
                    type: playerJSON.type,
                    score: playerJSON.score,
                    x: playerJSON.x,
                    y: playerJSON.y
                });

                player.render();
                player.sprite.body.allowGravity = false;

                return player;
            }

            this.game.socket.on('player:new', (playerJSON, players) => {
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

                    this.game.opponents[playerJSON.id] = buildPlayer(this.game, playerJSON);
                });
            });

            this.game.socket.on('player:move', (playerJSON) => {
                if (playerJSON.id === this.game.player.id) {
                    // The same player. Ignore it.
                    console.log('[?] ignore my moves (%s)', playerJSON.id);
                    return;
                }

                let opponent = this.game.opponents[playerJSON.id];

                if (!opponent) {
                    // Not yet created (rendered).
                    console.log('[?] not yet created (%s)', playerJSON.id);
                    return;
                }

                this.game.opponents[playerJSON.id].sprite.x = playerJSON.x;
                this.game.opponents[playerJSON.id].sprite.y = playerJSON.y;
            });

            this.game.socket.emit('player:new', this.game.player.toJSON());

            this.game.socket.on('connect', () => {
                console.log('[$] socket: connect');
            });

            this.game.socket.on('disconnect', () => {
                console.log('[$] socket: disconnect');

                // Disable keyboard
                this.game.input.enabled = false;

                new Message('ERR: Please reload app', () => {
                    window.location.reload();
                });
            });

            this.game.socket.on('error', () => {
                console.log('[$] socket: error');
            });

            this.state.start('Game');
        });

        this.displayLabel({
            message: `Hello "${this.name}"!`,
            y: (this.game.height / 2) - 30
        });
        this.displayLabel({
            message: 'Click to begin',
            y: (this.game.height / 2) + 50,
            font: 'bold 32px Verdana'
        });
    }
}
