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

            if (key === ENTER_KEY) {
                close();
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

        // Reset keyboard, to not trigger any keydown events!
        game.input.keyboard.reset();
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
