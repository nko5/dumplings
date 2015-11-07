import AbstractState from './AbstractState';

export default class GameState extends AbstractState {
    preload() {
        this.load.json('positions-1', 'assets/items/positions-1.json');

        this.load.spritesheet('gameboy-tileset', 'assets/tilesets/gameboy-tileset.png', 16, 16);
        this.load.tilemap('map-1', 'assets/maps/map-1.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.atlasJSONHash(
            'mms',
            'assets/sprites/mms.png',
            'assets/sprites/mms.json'
        );
    }

    create() {
        this._setupWorld();
        this.game.player.render();
        this._setupItems();
    }

    _setupWorld() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 250;

        let map = this.game.add.tilemap('map-1');
        map.addTilesetImage('gameboy-tileset');
        map.setCollision([
            5, 14, 16, 25,  // world bounds
            45, 46, 47,     // ground 1
            65, 66, 67,     // ground 2
            40, 41, 42,     // ground 3
            0, 38, 48,      // plates
            35, 36, 37,     // ground 4
            8, 18, 28       // ground 5
        ].map((i) => i + 1));

        this.worldLayer = map.createLayer('Tile Layer 1');
        this.worldLayer.resizeWorld();
    }

    _setupItems() {
        let items = this.game.items = this.add.group();

        let places = this.cache.getJSON('positions-1');

        places.forEach(({ x, y }) => {
            let item = this.add.tileSprite(x * 16, y * 16, 16, 16, 'gameboy-tileset', 2);
            this.physics.arcade.enable(item);
            item.body.allowGravity = false;
            items.add(item);
        });
    }

    update() {
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        this.game.physics.arcade.collide(this.game.player.sprite, this.worldLayer);
        this.game.physics.arcade.collide(this.game.player.sprite, this.game.items, (player, item) => {
            item.destroy();
        });
    }

    _handleKeyboard() {
        let player = this.game.player;
        let sprite = player.sprite;
        let body = sprite.body;
        let keyboard = this.input.keyboard;

        body.velocity.x = 0;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            body.velocity.x = -150;
            sprite.scale.x = -1;
            sprite.animations.play('walk');
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            body.velocity.x = 150;
            sprite.scale.x = 1;
            sprite.animations.play('walk');
        } else {
            sprite.animations.play('stay');
        }

        if (body.onFloor() && (keyboard.isDown(Phaser.Keyboard.UP) || keyboard.isDown(Phaser.Keyboard.SPACEBAR))) {
            body.velocity.y = -200;
        }
    }

    render() {
        // let player = this.game.player;
        // this.game.debug.bodyInfo(player.sprite, 25, 25);
        // this.game.debug.body(player.sprite);
    }
}
