import BootState from './states/BootState';
import CollectingState from './states/CollectingState';

export default class Game {
    constructor(options) {
        let phaser = new Phaser.Game(950, 450, Phaser.AUTO, 'area');

        phaser.username = options.username;

        phaser.state.add('Boot', BootState);
        phaser.state.add('Collecting', CollectingState);

        phaser.state.start('Boot');
    }
}
