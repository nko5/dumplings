import Game from './game';
import Authorization from './authorization';


Authorization.signIn((options) => {
    return new Game({
        username: options.name
    });
});
