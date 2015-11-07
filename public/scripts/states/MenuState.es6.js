export default class MenuState extends Phaser.State {
    preload() {
        // this.load.image('geek', '');
        this.game.load.spritesheet('gameboy-tileset', 'assets/tilesets/gameboy-tileset.png', 16, 16);
        this.load.tilemap('map-1',  'assets/maps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
    }

    create() {
        console.log(this.game.player);

        let map = this.game.add.tilemap('map-1');
        map.addTilesetImage('gameboy-tileset');
        map.setCollisionBetween(1, 256);

        let worldLayer = map.createLayer('Tile Layer 1');
        worldLayer.resizeWorld();
    }

    update() {

    }

    render() {

    }
}
