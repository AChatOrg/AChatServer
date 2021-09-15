const express = require('express');
const http = require('http');
const config = require('./config');
const mongoose = require('./da/mongoose');
const userApi = require('./api/userApi');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Welcome to A Chat')
});

server.listen(config.port);
mongoose.connect(config.mongodpServerUrl);
userApi.listen(app);