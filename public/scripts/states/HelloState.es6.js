import Board from '../models/Board';
import Player from '../models/Player';
import SocketBridge from '../models/SocketBridge';
import AbstractState from './AbstractState';

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

            this.game.player = new Player(this.game, {
                name: this.name
            });

            this.game.opponents = {};

            this.game.socket = new SocketBridge(this.game);

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
