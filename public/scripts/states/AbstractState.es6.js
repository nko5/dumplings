export default class AbstractState extends Phaser.State {
    displayLabel(message) {
        let style = { font: "bold 32px Verdana", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        let label = this.add.text(this.game.width / 2, this.game.height / 2, message, style);
        label.anchor.setTo(0.5, 0.5);
        return label;
    }
}
