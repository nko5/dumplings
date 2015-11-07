import HelloState from './states/HelloState';
import GameState from './states/GameState';

export default class Game {
    game = null;

    constructor() {
        this.game = new Phaser.Game(800, 450, Phaser.AUTO, 'area');

        this.game.state.add('Hello', HelloState);
        this.game.state.add('Game', GameState);
    }

    start(options) {
        this.game.state.start('Hello', true, false, options);
    }
}
