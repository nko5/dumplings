let ESCAPE_KEY = 32;
let ENTER_KEY = 13;

export default class Message {
    game = this;

    constructor(game, { message, type, callback }) {
        this.game = game;
        let $messages = document.querySelector('#messages');

        Message.block(this.game);

        let $message = document.createElement('p');
        $message.textContent = message;
        $message.classList.add(`message-${type}`);

        let close = () => {
            Message.clear(this.game);
            callback();
            document.removeEventListener('keydown', keyDownHandler);
        };

        function keyDownHandler(evt) {
            let key = evt.keyCode;

            switch (key) {
                case ESCAPE_KEY:
                case ENTER_KEY:
                    close();
                    break;

                // no default
            }
        }

        $message.addEventListener('click', close);
        document.addEventListener('keydown', keyDownHandler, false);

        $messages.appendChild($message);
    }

    static block(game) {
        let $messages = document.querySelector('#messages');

        $messages.innerHTML = '';

        // Display message
        $messages.style.display = 'block';

        // Disable keyboard
        game.input.enabled = false;
    }

    static clear(game) {
        let $messages = document.querySelector('#messages');

        $messages.innerHTML = '';

        // Hidden message
        $messages.style.display = 'none';

        // Enable keyboard
        game.input.enabled = true;
    }
}
