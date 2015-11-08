var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

// ENV
require('./server/env')(app);

// HTTP
require('./server/http-server')(app, express, http, port);

// Socket.io
require('./server/socket-server')(io);
