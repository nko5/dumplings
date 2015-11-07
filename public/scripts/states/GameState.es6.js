import Settings from '../config';
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
        this.game.board.render();
        this.game.player.render({
            type: 'blue'
        });
        this._setupItems();

        this.game.board.updatePlayerScore(this.game.player);
        this.game.board.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);
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
        this.game.items = this.add.group();
        let places = this.cache.getJSON('positions-1');
        places.forEach(({x, y}) => this._createItem(x, y));
        this._setupRandomAppear();
        this._setupRandomDisappear();
    }

    _createItem(x, y) {
        let item = this.add.tileSprite(x * 16, y * 16, 16, 16, 'gameboy-tileset', 2);
        this.physics.arcade.enable(item);
        item.name = 'item';
        item.body.allowGravity = false;
        this.game.items.add(item);
    }

    _setupRandomAppear() {
        let board = this.game.board;
        let items = this.game.items;
        let clock = this.time.create();

        clock.repeat(Settings.INTERVAL_ITEMS_APPEAR, Infinity, () => {
            let x = this.rnd.integerInRange(1, 49);
            let y = this.rnd.integerInRange(1, 24);

            this._createItem(x, y);

            board.updateAvailableScore(items.length * Settings.ITEM_POINT);
        });

        clock.start();
    }

    _setupRandomDisappear() {
        let board = this.game.board;
        let items = this.game.items;
        let clock = this.time.create();

        clock.repeat(Settings.INTERVAL_ITEMS_DISAPPEAR, Infinity, () => {
            let index = this.rnd.integerInRange(0, items.length - 1);

            try {
                // Hack which resolves:
                // Uncaught Error: getChildAt: Supplied index 0 does not exist in the child list, or the supplied DisplayObject must be a child of the caller
                items.removeChildAt(index);
            } catch (ignore) {
                console.warn('Error happen during randomly removed items');
            }

            board.updateAvailableScore(items.length * Settings.ITEM_POINT);
        });

        clock.start();
    }

    update() {
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        let player = this.game.player;
        let board = this.game.board;

        this.game.physics.arcade.collide(player.sprite, this.worldLayer);
        this.game.physics.arcade.collide(player.sprite, this.game.items, (sprite, item) => {
            item.destroy();
            player.addScore(Settings.ITEM_POINT);
            board.updatePlayerScore(player);
        });

        this.game.physics.arcade.overlap(this.game.items, this.worldLayer, (item, map) => {
            if (map.index !== -1) {
                item.destroy();
            }
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
