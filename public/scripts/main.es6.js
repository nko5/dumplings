import MenuState from './states/MenuState';

class Game {
    constructor() {
        this.game = new Phaser.Game(800, 400, Phaser.AUTO, 'game');

        this.game.state.add('Menu', MenuState);

        this.game.state.start('Menu');
    }
}

new Game();
