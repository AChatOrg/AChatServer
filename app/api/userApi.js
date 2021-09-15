const userManager = require('../bl/UserManager');
const User = require('../model/User');

module.exports = {
    listen: function (app) {
        app.post('/register', (req, res) => {
            let body = req.body;
            let user = new User(null, body.username, body.password, body.name, body.bio, body.gender);
            userManager.register(user)
                .then(userSaved => {
                    res.send(userSaved);
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
    }
};
