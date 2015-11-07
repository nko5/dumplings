export default class Message {
    $messages = null;

    constructor(label, callbackk) {
        this.$messages = document.querySelector('#messages');

        this._setupDOM(label, callbackk);
    }

    _setupDOM(label, callback) {
        this.$messages.style.display = 'block';

        let $message = document.createElement('p');
        $message.textContent = label;
        $message.addEventListener('click', callback);

        this.$messages.appendChild($message);
    }
}
