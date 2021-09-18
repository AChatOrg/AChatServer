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

const OnlineUser = require('./model/OnlineUser').OnlineUser;
const Key = require('./model/OnlineUser').Key;
const Tree = require('./model/Tree');

var tree = new Tree();

for (let i = 0; i < 10000; i++) {
    tree.add(new OnlineUser(i, i, i, i, '', '', '', 1));
}

let b = Date.now();
tree.list();
console.log(Date.now() - b);

console.log(JSON.stringify(tree).length);

function rand() {
    return Math.floor(Math.random() * 100);
}

function roughSizeOfObject(object) {

    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}