const express = require('express');
const http = require('http');
const config = require('./config');
const mongoose = require('./da/mongoose');
const userApi = require('./api/userApi');
const onlineUserList = require('./model/OnlineUserList');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Welcome to A Chat')
});

server.listen(config.port);
mongoose.connect(config.mongodpServerUrl);
userApi.listen(app, onlineUserList);

const OnlineUser = require('./model/OnlineUser');

for (let i = 0; i < 10; i++) {
    onlineUserList.add(new OnlineUser(i, 0, rand(), rand(), '', '', '', 1));
}
onlineUserList.remove(5)
console.log(onlineUserList.list());

function rand() {
    return Math.floor(Math.random() * 100);
}
