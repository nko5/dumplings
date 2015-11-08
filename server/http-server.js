module.exports = function (app, express, http, port) {
    app.use(express.static(__dirname + '/../public'));

    http.listen(port, function () {
        console.log('Listening on *:' + port);
    });
};
