const userManager = require('../bl/loginManager');
const LoggedUser = require('../model/LoggedUser');
const OnlineUser = require('../model/OnlineUser').OnlineUser;

module.exports = {
    listen: function (app, onlineUserList) {

        app.get('/onlineUsers', (req, res) => {
            let ipv4 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (onlineUserList.exist(ipv4)) {
                res.send(onlineUserList.list());
            } else {
                res.status(403).send({ message: 'You are not logged in.' });
            }
        });
    }
};
