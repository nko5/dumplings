export default class MenuState extends Phaser.State {
    preload() {
        this.load.image('geek', '');
    }

    create() {
        console.log(this.game.player);
    }

    update() {

    }

    render() {

    }
}
