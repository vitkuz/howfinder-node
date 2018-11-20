const path = require('path');
const http = require('http');
const express = require('express');
const socetIO = require('socket.io');

const configPath = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({ path: configPath});

const { ENV, PORT } = require('../../config/config');

const app = express();

// Express app config
require('./startup/appconfig')(app);
// Apply all routes
require('./startup/routes')(app);

const server = http.createServer(app);
const io = socetIO(server);

require('./startup/io')(io);

server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Running on ${PORT}. Environment ${ENV}`);
});