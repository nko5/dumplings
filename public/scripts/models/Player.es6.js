export default class Player {
    game = null;
    name = 'no name';
    sprite = null;
    score = 0;

    constructor(game) {
        this.game = game;
    }

    types() {
        return [
            {
                type: 'red',
                stay: [2, 4, 8, 11, 14].map((i) => i - 1),
                walk: [1, 5, 7, 32, 13, 15].map((i) => i - 1)
            },
            {
                type: 'yellow',
                stay: [17, 20, 22, 26, 29].map((i) => i - 1),
                walk: [16, 19, 23, 25, 28, 30].map((i) => i - 1)
            },
            {
                type: 'green',
                stay: [42, 62].map((i) => i - 1),
                walk: [43, 45, 47, 49, 50, 51].map((i) => i - 1)
            },
            {
                type: 'blue',
                stay: [53, 55, 57, 59].map((i) => i - 1),
                walk: [52, 54, 56, 58, 60, 61].map((i) => i - 1)
            }
        ]
    }

    render(options) {
        let type = this.types().find((item) => {
            return (item.type == options.type);
        });

        if (!type) {
            throw new Error('Player#render: type is undefined');
        }

        let sprite = this.sprite = this.game.add.sprite(50, 70, 'mms');
        sprite.name = 'player';
        sprite.anchor.setTo(0.5, 1);

        sprite.animations.add('stay', type.stay, 3, true, true);
        sprite.animations.add('walk', type.walk, 8, true, true);

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

    addScore(score) {
        this.score += score;
    }
}
