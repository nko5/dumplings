import Player from '../models/Player';
import AbstractState from './AbstractState';

export default class MenuState extends AbstractState {
    preload() {
        this.load.image('footer_lodyas', 'assets/images/footer_lodyas.png');
    }

    create() {
        this.add.image(0, 0, 'footer_lodyas');

        this.displayClick(() => {
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
