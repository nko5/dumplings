import Game from './game';
import Authorization from './authorization';

let game = new Game();

Authorization.signIn((options) => {
    game.start(options);
});
