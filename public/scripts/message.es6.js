export default class Message {
    game = this;
    $messages = null;

    constructor(game, options) {
        this.game = game;
        this.$messages = document.querySelector('#messages');

        // Disable keyboard
        this.game.input.enabled = false;

        this._setupDOM(options);
    }

    _setupDOM({ message, type, callback }) {
        this.$messages.innerHTML = '';
        this.$messages.style.display = 'block';

        let $message = document.createElement('p');
        $message.textContent = message;
        $message.addEventListener('click', () => {
            // Enable keyboard
            this.game.input.enabled = true;

            // Hidden message
            this.$messages.style.display = 'none';

            callback();
        });
        $message.classList.add(`message-${type}`);

        this.$messages.appendChild($message);
    }
}
