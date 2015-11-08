import Settings from '../config';

export default class Board {
    game = null;

    playerScore = null;
    availableScore = null;
    clock = null;

    style = {
        font: "bold 24px Tahoma",
        fill: "#fff",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };

    constructor(game) {
        this.game = game;
    }

    render() {
        // this.add.image(0, 400, 'footer_lodyas');
        this.playerScore = this._displayPlayerScore();
        this.availableScore = this._displayAvailableScore();
        this.clock = this._displayClock();
    }

    _displayPlayerScore() {
        return this.game.add.text(10, this.game.height - Settings.MARGIN_BETWEEN_BOARD_TEXT_TOP, '', this.style);
    }

    _displayAvailableScore() {
        let label = this.game.add.text(this.game.width - 10, this.game.height - Settings.MARGIN_BETWEEN_BOARD_TEXT_TOP, '', this.style);
        label.anchor.setTo(1, 0);
        return label;
    }

    _displayClock() {
        let label = this.game.add.text(this.game.width / 2, this.game.height - Settings.MARGIN_BETWEEN_BOARD_TEXT_TOP, '00:00', this.style);
        label.anchor.setTo(0.5, 0);
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
