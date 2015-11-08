export default class AbstractState extends Phaser.State {
    displayLabel({ message, x, y, font }) {
        let label = this.add.text(x || this.game.width / 2, y || this.game.height / 2, message, {
            font: font || "lighter 54px Verdana",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        label.anchor.setTo(0.5, 0.5);
        return label;
    }

    displayClick(callback) {
        let button = this.add.button(0, 0, '', callback, this);
        button.width = this.game.width;
        button.height = this.game.height;
    }

    static isMoving(sprite) {
        return (Math.abs(sprite.body.velocity.x) > 1 || Math.abs(sprite.body.velocity.y) > 1);
    }
}
