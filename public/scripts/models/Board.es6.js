import Settings from '../config';
import Utilities from '../utilities';

export default class Board {
    game = null;

    playerScore = null;
    availableScore = null;
    clockLabel = null;

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
        this.clockLabel = this._displayClock();
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
        label.addColor('#F9A605', 0);
        return label;
    }

    startClock(time, callback) {
        let clock = this.game.time.create();
        let remain = time;

        // Wait a second on '00:00'
        time++;

        clock.repeat(1000, time, () => {
            this.clockLabel.setText(Utilities.formatSeconds(remain));

            if (remain === 0) {
                this.clockLabel.addColor('#ff0000', 0);

                if (typeof callback === 'function') {
                    callback();
                }
            }

            remain--;
        });

        clock.start();
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
