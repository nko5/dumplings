import Board from '../models/Board';
import Player from '../models/Player';
import AbstractState from './AbstractState';

export default class HelloState extends AbstractState {
    init(options) {
        this.name = options.name;
    }

    preload() {
        this.load.image('congruent_outline', 'assets/images/congruent_outline.png');
        this.load.image('footer_lodyas', 'assets/images/footer_lodyas.png');
    }

    create() {
        this.game.stage.backgroundColor = 'rgba(0, 0, 0, 1)';

        this.displayClick(() => {
            this.game.board = new Board(this.game);

            this.game.opponents = {};
            this.game.player = new Player(this.game, {
                name: this.name
            });

            this.game.socket = io();

            this.game.socket.on('new:player', (player) => {
                if (player.name === this.game.player.name) {
                    this.game.player.id = player.id;
                    console.debug('[?] ignore user (the same name)');
                } else {
                    console.info('[+] new player', player);

                    this.game.opponents[player.id] = new Player(this.game, {
                        name: player.name,
                        type: player.type,
                        score: player.score,
                        x: player.x,
                        y: player.y
                    });
                    this.game.opponents[player.id].render();
                    this.game.opponents[player.id].sprite.body.allowGravity = false;
                }
            });

            this.game.socket.emit('new:player', {
                name: this.game.player.name,
                type: this.game.player.type,
                score: this.game.player.score,
                x: this.game.player.x,
                y: this.game.player.y
            });

            this.game.socket.on('connect', () => {
                console.log('[+] connect');
            });

            this.game.socket.on('disconnect', () => {
                console.log('[-] disconnect');
            });

            this.state.start('Game');
        });

        this.displayLabel({
            message: `Hello "${this.name}"!`,
            y: (this.game.height / 2) - 30
        });
        this.displayLabel({
            message: 'Click to begin',
            y: (this.game.height / 2) + 50,
            font: 'bold 32px Verdana'
        });
    }
}
