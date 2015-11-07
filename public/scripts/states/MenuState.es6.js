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

            this.game.socket = io();

            this.game.socket.on('new:player', (player) => {
                if (player.name === this.game.player.name) {
                    console.debug('[?] ignore user (the same name)');
                }
            });

            this.game.socket.emit('new:player', { name: this.game.player.name });

            this.game.socket.on('connect', () => {
                console.log('[+] connect');
            });

            this.game.socket.on('disconnect', () => {
                console.log('[-] disconnect');
            });

            this.state.start('Game');
        });

        this.displayLabel('Click to begin');
    }

    update() {

    }

    render() {

    }
}
