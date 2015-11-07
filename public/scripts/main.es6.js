import Player from './models/Player';
import MenuState from './states/MenuState';
import GameState from './states/GameState';

class Game {
    constructor() {
        this.game = new Phaser.Game(800, 400, Phaser.AUTO, 'area');

        this.game.player = new Player(this.game);

        this.game.state.add('Menu', MenuState);
        this.game.state.add('Game', GameState);

        this.game.state.start('Menu');
    }
}

new Game();
