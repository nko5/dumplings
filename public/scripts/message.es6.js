export default class Message {
    $messages = null;

    constructor(label, callback) {
        this.$messages = document.querySelector('#messages');

        this._setupDOM(label, callback);
    }

    _setupDOM(label, callback) {
        this.$messages.innerHTML = '';
        this.$messages.style.display = 'block';

        let $message = document.createElement('p');
        $message.textContent = label;
        $message.addEventListener('click', callback);

        this.$messages.appendChild($message);
    }
}
