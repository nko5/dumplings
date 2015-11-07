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

            this.game.socket.on('player:new', (player) => {
                if (player.id === this.game.player.id) {
                    // The same player. Ignore it.
                    this.game.player.id = player.id;
                    console.debug('[?] ignore user (the same id)');
                    return;
                }

                console.info('[+] new player', player);

                this.game.opponents[player.id] = new Player(this.game, {
                    id: player.id,
                    name: player.name,
                    type: player.type,
                    score: player.score,
                    x: player.x,
                    y: player.y
                });
                this.game.opponents[player.id].render();
                this.game.opponents[player.id].sprite.body.allowGravity = false;
            });

            this.game.socket.on('player:move', (player) => {
                if (player.id === this.game.player.id) {
                    // The same player. Ignore it.
                    // console.debug('[?] ignore my moves');
                    return;
                }

                let opponent = this.game.opponents[player.id];

                if (!opponent) {
                    // Not yet created (rendered).
                    return;
                }

                this.game.opponents[player.id].sprite.x = player.x;
                this.game.opponents[player.id].sprite.y = player.y;
            });

            this.game.socket.emit('player:new', this.game.player.toJSON());

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
