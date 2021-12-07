const { Server } = require("socket.io");

const loginManager = require('../bl/loginManager')
const operations = require('../config').operations;
const peopleApi = require('./peopleApi');

module.exports = {
    listen: function (server) {
        const io = new Server(server);

        io.use((socket, next) => {
            let data = JSON.parse(socket.handshake.query.data);
            if (data) {
                switch (data.operation) {
                    case operations.loginGuest:
                        let people = loginManager.createGuest(data.name || 'Unknown', data.bio || '', data.gender || 1);
                        if (people) {
                            socket.people = people;
                            console.log('success loginGuest : ' + people.name);
                            return next();
                        }
                        break;
                }
            }
        })

        io.on('connection', socket => {
            let people = socket.people;
            loginManager.addPeople(people);
            socket.join(people.key.uuid)
            socket.emit('logged', people);
            socket.broadcast.emit('userCame', people);
            console.log('connected : ' + people.name);

            socket.on("disconnect", async () => {
                let userId = socket.people.key.uuid;
                const matchingSockets = await io.in(userId).allSockets();
                const isDisconnected = matchingSockets.size === 0;
                if (isDisconnected) {
                    loginManager.removePeople(userId);
                    socket.broadcast.emit("userLeft", userId);
                    console.log('disconnected : ' + people.name);
                }
            });

            peopleApi.listen(socket);
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
