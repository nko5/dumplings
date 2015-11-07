import AbstractState from './AbstractState';

export default class GameState extends AbstractState {
    preload() {
        this.load.spritesheet('gameboy-tileset', 'assets/tilesets/gameboy-tileset.png', 16, 16);
        this.load.tilemap('map-1', 'assets/maps/map-1.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.atlasJSONHash(
            'mms',
            'assets/sprites/mms.png',
            'assets/sprites/mms.json'
        );
    }

    create() {
        this.game.player.render();

        let map = this.game.add.tilemap('map-1');
        map.addTilesetImage('gameboy-tileset');
        map.setCollisionBetween(1, 256);

        let worldLayer = map.createLayer('Tile Layer 1');
        worldLayer.resizeWorld();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    update() {

    }

    render() {

    }
}
