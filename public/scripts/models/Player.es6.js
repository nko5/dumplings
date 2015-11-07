export default class Player {
    game = null;
    name = 'no name';

    constructor(game) {
        this.game = game;
        console.log('create new player');
    }

    render() {
        let sprite = this.game.add.sprite(50, 90, 'mms');

        sprite.anchor.setTo(0, 1);
        // sprite.scale.setTo(0.8, 0.8);
        // sprite.scale.x = -1;

        sprite.animations.add('stay', [2, 4, 8, 11, 14].map((i) => i - 1), 3, true, true);
        sprite.animations.add('walk', [1, 5, 7, 32, 13, 15].map((i) => i - 1), 8, true, true);

        sprite.animations.play('walk');
    }
}
