export default class ResultsBoard {
    game = null;

    titleLabel = null;
    listLabel = null;

    constructor(game) {
        this.game = game;
    }

    render() {
        let players = [
            this.game.player.toJSON()
        ];

        players.concat(_.toArray(this.game.opponents));

        this.titleLabel = this._displayTitleLabel();
        this.listLabel = this._displayPayerList();

        this.updatePlayerList(players);
    }

    _displayTitleLabel() {
        return this.game.add.text(810, 10, 'Ranking', { font: 'lighter 24px Tahoma', fill: '#F9A605' });
    }

    _displayPayerList() {
        return this.game.add.text(810, 50, '', { font: "12px Tahoma", fill: '#ffff00' });
    }

    updatePlayerList(players) {
        this.listLabel.setText(ResultsBoard.parse(players));
    }

    static parse(players) {
        var results = [];

        players = _.sortBy(players, (player) => player.score);
        players.reverse();

        players.forEach((player, index) => {
            results.push(`${index + 1}. ${player.name} - ${player.score}pkt`);
        });

        return results.join('\n');
    }
}
