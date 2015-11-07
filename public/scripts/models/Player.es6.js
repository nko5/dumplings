export default class Player {
    game = null;
    name = 'no name';
    sprite = null;

    constructor(game) {
        this.game = game;
    }

    render() {
        let sprite = this.sprite = this.game.add.sprite(50, 70, 'mms');

        sprite.anchor.setTo(0, 1);
        // sprite.scale.setTo(0.8, 0.8);

        sprite.animations.add('stay', [2, 4, 8, 11, 14].map((i) => i - 1), 3, true, true);
        sprite.animations.add('walk', [1, 5, 7, 32, 13, 15].map((i) => i - 1), 8, true, true);

        sprite.animations.play('stay');

        this._enablePhysics();
    }

    _enablePhysics() {
        this.game.physics.arcade.enable(this.sprite);

        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.linearDamping = 1;

        // this.sprite.body.setSize(30, 30, 0, 10);
    }
}
