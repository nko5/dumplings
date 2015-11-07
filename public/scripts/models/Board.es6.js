import Settings from '../config';

export default class Board {
    game = null;
    playerScore = null;
    availableScore = null;

    constructor(game) {
        this.game = game;
    }

    render() {
        // this.add.image(0, 400, 'footer_lodyas');
        this.playerScore = this._displayPlayerScore();
        this.availableScore = this._displayAvailableScore();
    }

    _displayPlayerScore() {
        return this.game.add.text(10, 410, '', {
            font: "bold 24px Tahoma",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
    }

    _displayAvailableScore() {
        let label = this.game.add.text(this.game.width - 10, 410, '', {
            font: "bold 24px Tahoma",
            fill: "#fff",
            boundsAlignH: "right",
            boundsAlignV: "middle"
        });

        label.anchor.setTo(1, 0);

        return label;
    }

    updatePlayerScore(player) {
        let record = localStorage.getItem(Settings.STORAGE_RECORD_SCORE) || 0;

        if (player.score > record) {
            record = player.score;
            localStorage.setItem(Settings.STORAGE_RECORD_SCORE, player.score);
        }

        this.playerScore.text = `Personal best: ${record}`;
    }

    updateAvailableScore(max) {
        this.availableScore.text = `Available points: ${max}`;
    }
}
