const { Server } = require("socket.io");

const loginManager = require('../bl/loginManager')
const operations = require('../config').operations;

module.exports = {
    listen: function (server) {
        const io = new Server(server);

        io.use((socket, next) => {
            let ipv4 = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
            let data = JSON.parse(socket.handshake.query.data);

            if (data && ipv4) {
                switch (data.operation) {
                    case operations.loginGuest:
                        let result = loginManager.loginGuest(ipv4, data.name || 'Unknown', data.bio || '', data.gender || 1);
                        if (result.logged) {
                            socket.user = result.people;
                            next();
                            console.log('success loginGuest : ' + data.name);
                        } else {
                            next(new Error('This user is online.'));
                            console.log('loginGuest : This user is online.');
                        }
                        break;
                }
            }
        })

        io.on('connection', socket => {
            let user = socket.user;
            socket.emit('logged', user);
            socket.broadcast.emit('userCame', user);
        });

        // app.post('/register', (req, res) => {
        //     let body = req.body;
        //     let user = new LoggedUser(null, body.username, body.password,
        //         body.name, body.avatar, body.bio, body.gender, undefined, undefined);
        //     loginManager.register(user)
        //         .then(userSaved => {
        //             res.json(userSaved);
        //             console.log('success register :' + userSaved);
        //         })
        //         .catch(err => {
        //             if (err.code === 11000) {
        //                 res.status(409).send({ message: 'This username already exist.' });
        //                 console.log('register : This username already exist.');
        //             } else {
        //                 res.status(400).send({ message: err });
        //                 console.error('error register :' + err);
        //             }
        //         });
        // });
    }
};
