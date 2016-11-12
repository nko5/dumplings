import Settings from './config';

let $form = document.querySelector('#form');
let $name = $form.querySelector('#name');

let loadName = () => {
    return localStorage.getItem(Settings.STORAGE_USERNAME);
};

let saveName = (name) => {
    localStorage.setItem(Settings.STORAGE_USERNAME, name);

    window.addEventListener('storage', (options) => {
        if (options.key === Settings.STORAGE_USERNAME) {
            if (!options.newValue || !valid(options.newValue)) {
                window.location.reload();
            }
        }
    });
};

let start = (name, cb) => {
    $form.parentNode.removeChild($form);
    cb({
        name: name
    });
};

let valid = (name) => {
    name = name.trim();

    if (name.length < 2) {
        alert('ERROR: Please put at least 2 chars');
        return false;
    }

    if (name.length > 10) {
        alert('ERROR: To much chars');
        return false;
    }

    return true;
};

let fetchFromUser = (cb) => {
    $form.style.opacity = 1;

    $name.addEventListener('keydown', function (evt) {
        if (evt.keyCode !== 13) {
            return;
        }

        if (valid(this.value)) {
            saveName(this.value);
            cb();
        }
    });
};

let singIn = (cb) => {
    let name = loadName();

    if (name && valid(name)) {
        start(name, cb);
    } else {
        fetchFromUser(() => {
            singIn(cb);
        });
    }
};

export default {
    signIn: singIn
};
