const userManager = require('../bl/loginManager');
const LoggedUser = require('../model/LoggedUser');
const OnlineUser = require('../model/OnlineUser').OnlineUser;

module.exports = {
    listen: function (app, onlineUserList) {

        app.get('/onlineUsers', (req, res) => {
            res.send(onlineUserList.list());
        });
    }
};
