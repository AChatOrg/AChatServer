const express = require('express');
const http = require('http');
const config = require('./config');
const mongoose = require('./da/mongoose');
const userApi = require('./api/userApi');
const OnlineUserList = require('./model/OnlineUserList');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const onlineUserList = new OnlineUserList();

app.get('/', (req, res) => {
    res.send('<h1>Welcome to A Chat.</h1>')
});

server.listen(config.port);
mongoose.connect(config.mongodpServerUrl);
userApi.listen(app, onlineUserList);