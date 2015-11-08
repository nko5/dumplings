import AbstractState from './AbstractState';

export default class BootState extends AbstractState {
    preload() {
        this.load.image('congruent_outline', 'assets/images/congruent_outline.png');

        this.load.spritesheet('gameboy-tileset', 'assets/tilesets/gameboy-tileset.png', 16, 16);
        this.load.tilemap('map-1', 'assets/maps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.atlasJSONHash('mms', 'assets/sprites/mms.png', 'assets/sprites/mms.json');
    }

    create() {
        this.state.start('Collecting');
    }
}
