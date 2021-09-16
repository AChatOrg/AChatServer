const userManager = require('../bl/UserManager');
const LoggedUser = require('../model/LoggedUser');

module.exports = {
    listen: function (app) {
        app.post('/register', (req, res) => {
            let body = req.body;
            let user = new LoggedUser(null, body.username, body.password,
                body.name, body.avatar, body.bio, body.gender, undefined);
            userManager.register(user)
                .then(userSaved => {
                    res.json(userSaved);
                    console.log('success register :' + userSaved);
                })
                .catch(err => {
                    if (err.code === 11000) {
                        res.status(409).send({
                            message: 'This username already exist.'
                        });
                        console.log('register : This username already exist.');
                    } else {
                        res.status(400).send({
                            message: err
                        });
                        console.error('error register :' + err);
                    }
                });
        });

        app.get('/loginGuest', (req, res) => {
            console.log(req.query.name);
            var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            console.log(ip);
        });
    }
};
