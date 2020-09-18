const express = require('express');
const configureMiddleware = require('./configure-middleware')

const send = require('../send')

const server = express();

configureMiddleware(server);

server.use('/send', send)

server.get('/', (req, res) => {
    res.send("It's alive!");
  });

module.exports = server;