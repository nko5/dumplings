module.exports = function (app) {
    var env = app.get('env');

    switch (env) {
        case 'development':
            console.log('DEVELOPMENT');
            break;

        case 'production':
            console.log('PRODUCTION');
            break;
    }
};
