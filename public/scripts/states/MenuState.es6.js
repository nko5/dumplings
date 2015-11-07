import Board from '../models/Board';
import Player from '../models/Player';
import AbstractState from './AbstractState';

export default class MenuState extends AbstractState {
    preload() {
        this.load.image('congruent_outline', 'assets/images/congruent_outline.png');
        this.load.image('footer_lodyas', 'assets/images/footer_lodyas.png');
    }

    create() {
        this.game.stage.backgroundColor = 'rgba(0, 0, 0, 1)';

        this.displayClick(() => {
            this.game.board = new Board(this.game);
            this.game.player = new Player(this.game);
            this.state.start('Game');
        });

        this.displayLabel('Click to begin');
    }

    update() {

    }

    render() {

    }
}
