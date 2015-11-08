import Settings from '../config';
import Message from '../message';
import Item from '../models/Item';
import Player from '../models/Player';
import AbstractState from './AbstractState';

export default class GameState extends AbstractState {
    create() {
        this._setupWorld();

        this.game.board.render();
        this.game.player.render();
        this.game.items = this.add.group();

        this.game.items.isExists = (itemID) => {
            let isItemExists = false;

            this.game.items.forEach((item) => {
                if (item.id === itemID) {
                    isItemExists = true;
                }
            });

            return isItemExists;
        };

        this.game.board.updatePlayerScore(this.game.player);
        this.game.board.updateAvailableScore(this.game.items.length * Settings.ITEM_POINT);

        this.game.board.startClock(Settings.ROUND_TIME, () => {
            new Message(this.game, {
                message: 'Game over',
                type: 'info',
                callback: () => {
                    window.location.reload();
                }
            });
        });
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

    update() {
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        let player = this.game.player;
        let board = this.game.board;

        this.game.physics.arcade.collide(player.sprite, this.worldLayer);
        this.game.physics.arcade.collide(player.sprite, this.game.items, (sprite, item) => {
            this.game.socket.io.emit('item:remove', item.id);

            // item.destroy();
            player.addScore(Settings.ITEM_POINT);
            board.updatePlayerScore(player);
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
        let player = this.game.player;
        let sprite = player.sprite;

        if (AbstractState.isMoving(sprite)) {
            this.game.socket.io.emit('player:move', this.game.player.toJSON());
        }

        player.x = sprite.x;
        player.y = sprite.y;

        // let player = this.game.player;
        // this.game.debug.bodyInfo(player.sprite, 25, 25);
        // this.game.debug.body(player.sprite);
    }
}
