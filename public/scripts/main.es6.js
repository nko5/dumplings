import MenuState from './states/MenuState';
import GameState from './states/GameState';

class Game {
    constructor() {
        this.game = new Phaser.Game(800, 450, Phaser.AUTO, 'area');

        this.game.state.add('Menu', MenuState);
        this.game.state.add('Game', GameState);

        this.game.state.start('Menu');
    }
}

new Game();
