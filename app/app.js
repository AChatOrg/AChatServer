const express = require('express');
const http = require('http');

const config = require('./config');
const mongoose = require('./da/mongoose');
const loginApi = require('./api/loginApi');
const uplaod = require('./api/upload')

const app = express()
const server = http.createServer(app);

mongoose.connect(config.mongodpServerUrl);
server.listen(config.port);
loginApi.listen(server);
uplaod.listen(app)

app.get('/', (req, res) => {
    res.send('<h1>Welcome to A Chat.</h1>')
});
