export default class Message {
    $messages = null;

    constructor(game, options) {
        this.$messages = document.querySelector('#messages');

        // Disable keyboard
        game.input.enabled = false;

        this._setupDOM(options);
    }

    _setupDOM({ message, type, callback }) {
        this.$messages.innerHTML = '';
        this.$messages.style.display = 'block';

        let $message = document.createElement('p');
        $message.textContent = message;
        $message.addEventListener('click', callback);
        $message.classList.add(`message-${type}`);

        this.$messages.appendChild($message);
    }
}
