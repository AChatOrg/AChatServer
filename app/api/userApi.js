const userManager = require('../bl/UserManager');
const LoggedUser = require('../model/LoggedUser');
const OnlineUser = require('../model/OnlineUser');

module.exports = {
    listen: function (app, onlineUserList) {
        app.post('/register', (req, res) => {
            let body = req.body;
            let user = new LoggedUser(null, body.username, body.password,
                body.name, body.avatar, body.bio, body.gender, undefined, undefined);
            userManager.register(user)
                .then(userSaved => {
                    res.json(userSaved);
                    console.log('success register :' + userSaved);
                })
                .catch(err => {
                    if (err.code === 11000) {
                        res.status(409).send({ message: 'This username already exist.' });
                        console.log('register : This username already exist.');
                    } else {
                        res.status(400).send({ message: err });
                        console.error('error register :' + err);
                    }
                });
        });

        app.get('/loginGuest', (req, res) => {
            let query = req.query;
            let ipv4 = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            let user = new OnlineUser(ipv4, query.name, query.avatar, query.bio, query.gender, 0, 0, Date.now());
            if (onlineUserList.exist(ipv4)) {
                res.status(409).send({ message: 'This user is online.' });
                console.log('loginGuest : This user is online.');
            } else {
                onlineUserList.add(user);
                res.json(user);
                console.log('success loginGuest :' + user);
            }
        });

        app.get('/onlineUsers', (req, res) => {

        });
    }
};
