import Settings from '../config';

export default class Player {
    game = null;

    id = null;
    name = null;
    type = null;
    defaultPosition = {
        x: 0,
        y: 0
    };
    sprite = null;
    label = null;
    score = 0;

    constructor(game, options) {
        this.game = game;

        if (!options.id) {
            options.id = uuid.v4();
        }

        this.id = options.id;
        this.name = options.name;

        if (!options.type) {
            options.type = this._getRandomCharacter().type;
        }

        this.type = options.type;
        this.defaultPosition = this._getCharacter().position;

        console.log('[+] new player', options);
    }

    characters() {
        return [
            {
                type: 'red',
                stay: [2, 4, 8, 11, 14].map((i) => i - 1),
                walk: [1, 5, 7, 32, 13, 15].map((i) => i - 1),
                position: {
                    x: 50,
                    y: 96
                }
            },
            {
                type: 'yellow',
                stay: [17, 20, 22, 26, 29].map((i) => i - 1),
                walk: [16, 19, 23, 25, 28, 30].map((i) => i - 1),
                position: {
                    x: this.game.width - 64,
                    y: 96
                }
            },
            {
                type: 'green',
                stay: [42, 62].map((i) => i - 1),
                walk: [43, 45, 47, 49, 50, 51].map((i) => i - 1),
                position: {
                    x: 50,
                    y: this.game.height - 64
                }
            },
            {
                type: 'lightblue',
                stay: [53, 55, 57, 59].map((i) => i - 1),
                walk: [52, 54, 56, 58, 60, 61].map((i) => i - 1),
                position: {
                    x: this.game.width - 80,
                    y: this.game.height - 96
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

        let label = this.label = this.game.add.text(this.x, this.y - this.sprite.height - Settings.MARGIN_BETWEEN_PLAYER_AND_LABEL, this.name, {
            font: "lighter 11px Verdana",
            fill: character.type,
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        label.anchor.setTo(0.5, 0.5);

        this._enablePhysics();
    }

    _enablePhysics() {
        this.game.physics.arcade.enable(this.sprite);

        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.linearDamping = 1;

        // Smaller sprite to be less sensitive in collisions.
        this.sprite.body.setSize(this.sprite.width - 6, this.sprite.height);
    }

    addScore(score) {
        this.score += score;
    }

    remove() {
        this.sprite.destroy();
        this.label.destroy();
    }

    get x() {
        if (this.sprite) {
            return this.sprite.x;
        } else {
            return this.defaultPosition.x;
        }
    }

    set x(value) {
        this.sprite.x = value;
        this.label.x = value;
    }

    get y() {
        if (this.sprite) {
            return this.sprite.y;
        } else {
            return this.defaultPosition.y;
        }
    }

    set y(value) {
        this.sprite.y = value;
        this.label.y = value - this.sprite.height - Settings.MARGIN_BETWEEN_PLAYER_AND_LABEL;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            score: this.score,
            x: this.x,
            y: this.y
        }
    }
}
