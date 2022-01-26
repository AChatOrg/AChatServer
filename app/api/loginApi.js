const { Server } = require("socket.io");

const usersManager = require('../bl/usersManager')
const consts = require('../config').consts;
const userApi = require('./usersRoomsApi');
const chatApi = require('./chatApi');
const User = require('../model/User').User;

module.exports = {
    listen: function (server) {
        const io = new Server(server);

        io.use((socket, next) => {
            let data = JSON.parse(socket.handshake.query.data);
            if (data) {
                // let uid = socket.handshake.address || socket.handshake.headers["x-real-ip"];
                let user
                switch (data.operation) {
                    case consts.loginGuest:
                        user = new User(data.name, data.bio, data.gender, [], data.uid, 0, 0, Date.now());
                        user.androidId = data.androidId;
                        user.username = user.androidId;
                        user.offlineMessages = []
                        user.offlineReadMessageUids = []
                        user.roomUids = []
                        usersManager.putUser(user).then(userLogged => {
                            socket.user = new User(userLogged.name, userLogged.bio, userLogged.gender,
                                userLogged.avatars, userLogged.uid, userLogged.rank, userLogged.score,
                                userLogged.loginTime)
                            socket.user.androidId = userLogged.androidId;
                            socket.user.username = userLogged.username;
                            socket.user.onlineTime = userLogged.onlineTime;
                            console.log('success loginGuest : ' + user.name);
                            next();
                        }).catch(err => {
                            console.log(err);
                            next(new Error(err));
                        })
                        break;
                    case consts.reconnectGuest:
                        user = new User(data.name, data.bio, data.gender, [], data.uid, 0, 0, Date.now());
                        user.androidId = data.androidId;
                        user.username = user.androidId;
                        usersManager.updateUser(user).then(userLogged => {
                            socket.user = new User(userLogged.name, userLogged.bio, userLogged.gender,
                                userLogged.avatars, userLogged.uid, userLogged.rank, userLogged.score,
                                userLogged.loginTime)
                            socket.user.androidId = userLogged.androidId;
                            socket.user.username = userLogged.username;
                            socket.user.onlineTime = userLogged.onlineTime;
                            console.log('success reconnectGuest : ' + user.name);
                            next();
                        }).catch(err => {
                            console.log(err);
                            next(new Error(err));
                        })
                        break;
                }
            }
        })

        io.on('connection', socket => {
            let user = socket.user

            socket.join(user.key.uid)
            console.log('connected : ' + user.name);

            chatApi.sendOfflines(socket, user.key.uid)

            let added = usersManager.addUserIfNotExist(user);
            if (added) {
                socket.emit(consts.ON_LOGGED, user);
                socket.broadcast.emit(consts.ON_USER_CAME, user);
            }

            socket.on("disconnect", async () => {
                let user = socket.user
                let userId = user.key.uid;
                const matchingSockets = await io.in(userId).allSockets();
                const isDisconnected = matchingSockets.size === 0;

                let time = Date.now();
                usersManager.updateUser(user.key.uid, { onlineTime: time })
                socket.broadcast.emit(consts.ON_ONLINE_TIME, socket.user.key.uid, time);

                if (isDisconnected) {
                    usersManager.userList.remove(userId);
                    socket.broadcast.emit(consts.ON_USER_LEFT, user);
                    console.log('disconnected : ' + user.name);
                }
            });

            userApi.listen(io, socket);
            chatApi.listen(socket);
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
