const express = require('express');
const http = require('http');
const config = require('./config');
const mongoose = require('./da/mongoose');
const loginApi = require('./api/loginApi');
const usersApi = require('./api/usersApi');
const OnlineUserList = require('./model/OnlineUserList');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const onlineUserList = new OnlineUserList();

app.get('/', (req, res) => {
    res.send('<h1>Welcome to A Chat.</h1>')
});

//////////////////////////
const OnlineUser = require('./model/OnlineUser').OnlineUser;
for (let i = 0; i < 10; i++) {
    let user = new OnlineUser("name " + i, "bio " + i, Math.random() < 0.5 ? 1 : 2, "", true, i, Math.floor(Math.random() * (6 - 0 + 1) + 0), i, i);
    onlineUserList.add(user);
}
//////////////////////////

server.listen(config.port);
mongoose.connect(config.mongodpServerUrl);
loginApi.listen(app, onlineUserList);
usersApi.listen(app, onlineUserList);