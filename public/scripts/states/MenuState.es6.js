import AbstractState from './AbstractState';

export default class MenuState extends AbstractState {
    preload() {
        this.load.image('footer_lodyas', 'assets/images/footer_lodyas.png');
    }

    create() {
        this.add.image(0, 0, 'footer_lodyas');

        let button = this.add.button(0, 0, '', () => {
            this.state.start('Game');
        }, this);
        button.width = this.game.width;
        button.height = this.game.height;

        this.displayLabel('Click to begin');
    }

    update() {

    }

    render() {

    }
}
