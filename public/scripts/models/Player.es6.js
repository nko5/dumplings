export default class Player {
    game = null;
    name = null;

    type = null;
    defaultPosition = {
        x: 0,
        y: 0
    };
    sprite = null;
    score = 0;

    constructor(game, options) {
        this.game = game;
        this.name = options.name;

        let character = this._getRandomCharacter();

        this.type = options.type || character.type;
        this.defaultPosition = this._getCharacter().position || character.position;
    }

    characters() {
        return [
            {
                type: 'red',
                stay: [2, 4, 8, 11, 14].map((i) => i - 1),
                walk: [1, 5, 7, 32, 13, 15].map((i) => i - 1),
                position: {
                    x: 50,
                    y: 70
                }
            },
            {
                type: 'yellow',
                stay: [17, 20, 22, 26, 29].map((i) => i - 1),
                walk: [16, 19, 23, 25, 28, 30].map((i) => i - 1),
                position: {
                    x: this.game.width - 50,
                    y: 70
                }
            },
            {
                type: 'green',
                stay: [42, 62].map((i) => i - 1),
                walk: [43, 45, 47, 49, 50, 51].map((i) => i - 1),
                position: {
                    x: 50,
                    y: this.game.height - 100
                }
            },
            {
                type: 'blue',
                stay: [53, 55, 57, 59].map((i) => i - 1),
                walk: [52, 54, 56, 58, 60, 61].map((i) => i - 1),
                position: {
                    x: this.game.width - 50,
                    y: this.game.height - 100
                }
            }
        ]
    }

    _getRandomCharacter() {
        let types = this.characters();
        let index = this.game.rnd.integerInRange(0, types.length - 1);
        return types[index];
    }

    _getCharacter() {
        return this.characters().find((character) => {
            return character.type === this.type;
        });
    }

    render() {
        let character = this._getCharacter();
        let sprite = this.sprite = this.game.add.sprite(this.defaultPosition.x, this.defaultPosition.y, 'mms');
        sprite.name = 'player';
        sprite.anchor.setTo(0.5, 1);

        sprite.animations.add('stay', character.stay, 3, true, true);
        sprite.animations.add('walk', character.walk, 8, true, true);

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

    get x() {
        if (this.sprite) {
            return this.sprite.x;
        }

        return this.defaultPosition.x;
    }

    get y() {
        if (this.sprite) {
            return this.sprite.y;
        }

        return this.defaultPosition.y;
    }

    addScore(score) {
        this.score += score;
    }
}
