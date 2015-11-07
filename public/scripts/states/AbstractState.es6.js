export default class AbstractState extends Phaser.State {
    displayLabel(message, {x, y, size = 32}) {
        let style = {
            font: "bold " + size + "px Verdana",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        let label = this.add.text(x || this.game.width / 2, y || this.game.height / 2, message, style);
        label.anchor.setTo(0.5, 0.5);
        return label;
    }

    displayClick(callback) {
        let button = this.add.button(0, 0, '', callback, this);
        button.width = this.game.width;
        button.height = this.game.height;
    }
}
