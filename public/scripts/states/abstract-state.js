export default class AbstractState extends Phaser.State {
    static isMoved(sprite) {
        return (Math.abs(sprite.body.velocity.x) > 1 || Math.abs(sprite.body.velocity.y) > 1);
    }
}
