const { Server } = require("socket.io");

const usersManager = require('../bl/usersManager')
const roomsManager = require('../bl/roomsManager')
const consts = require('../config').consts;
const userApi = require('./usersRoomsApi');
const chatApi = require('./chatApi');
const User = require('../model/User').User;
const UserDao = require('../da/UserDao');
const uplaod= require('./upload');

const bcrypt = require('bcryptjs');

module.exports = {
    listen: function (app, server) {
        const io = new Server(server);
        uplaod.listen(app, io, usersManager);

        io.use((socket, next) => {
            let data = JSON.parse(socket.handshake.query.data);
            if (data) {
                // let uid = socket.handshake.address || socket.handshake.headers["x-real-ip"];
                let user;
                let username;
                switch (data.operation) {
                    case consts.loginGuest:
                        user = new User(data.name, data.bio, data.gender, [], data.uid, 0, 0, Date.now());
                        user.androidId = data.androidId;
                        user.username = data.uid;
                        user.avatars = ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6']
                        UserDao.save(user).then(userSaved => {
                            socket.user = new User(userSaved.name, userSaved.bio, userSaved.gender,
                                userSaved.avatars, userSaved.uid, userSaved.rank, userSaved.score,
                                userSaved.loginTime, userSaved.username)
                            socket.user.androidId = userSaved.androidId;
                            socket.user.username = userSaved.username;
                            socket.user.onlineTime = userSaved.onlineTime;
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
                        user.username = data.uid;
                        user.uid = data.uid;
                        UserDao.update(user).then(userLogged => {
                            socket.user = new User(userLogged.name, userLogged.bio, userLogged.gender,
                                userLogged.avatars, userLogged.uid, userLogged.rank, userLogged.score,
                                userLogged.loginTime, userLogged.username)
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
                    case consts.loginUser:
                        username = data.username;
                        let password = data.password;
                        usersManager.loginByPass(username, password).then(res => {
                            let userLogged = res.dbUser;
                            let token = res.token;
                            let refreshToken = res.refreshToken;

                            socket.user = new User(userLogged.name, userLogged.bio, userLogged.gender,
                                userLogged.avatars, userLogged.uid, userLogged.rank, userLogged.score,
                                userLogged.loginTime, userLogged.username)

                            socket.user.androidId = userLogged.androidId;
                            socket.user.username = userLogged.username;
                            socket.user.onlineTime = userLogged.onlineTime;

                            socket.user.token = token;
                            socket.user.refreshToken = refreshToken;

                            console.log('success loginUser : ' + socket.user.name);
                            next();

                        }).catch(err => {
                            console.log(err);
                            next(new Error(consts.CONNECTION_ERR_INCORRECT_PASS));
                        })
                        break;
                    case consts.reconnectUser:
                        username = data.username;
                        let token = socket.handshake.auth.token;
                        usersManager.reconnectUser(username, token).then(res => {
                            let userLogged = res.dbUser;
                            let token = res.token;
                            let refreshToken = res.refreshToken;

                            socket.user = new User(userLogged.name, userLogged.bio, userLogged.gender,
                                userLogged.avatars, userLogged.uid, userLogged.rank, userLogged.score,
                                userLogged.loginTime, userLogged.username)

                            socket.user.androidId = userLogged.androidId;
                            socket.user.username = userLogged.username;
                            socket.user.onlineTime = userLogged.onlineTime;

                            socket.user.token = token;
                            socket.user.refreshToken = refreshToken;

                            console.log('success reconnectUser : ' + socket.user.name);
                            next();

                        }).catch(err => {
                            console.log(err);
                            if (err == consts.CONNECTION_ERR_TOKEN_EXPIRED) {
                                next(new Error(consts.CONNECTION_ERR_TOKEN_EXPIRED));
                            } else {
                                next(new Error(err));
                            }
                        })
                        break;
                    case consts.reconnectUserByRefreshToken:
                        username = data.username;
                        let refreshToken = socket.handshake.auth.token;
                        usersManager.reconnectUserByRefreshToken(username, refreshToken).then(res => {
                            let userLogged = res.dbUser;
                            let token = res.token;
                            let refreshToken = res.refreshToken;

                            socket.user = new User(userLogged.name, userLogged.bio, userLogged.gender,
                                userLogged.avatars, userLogged.uid, userLogged.rank, userLogged.score,
                                userLogged.loginTime, userLogged.username)

                            socket.user.androidId = userLogged.androidId;
                            socket.user.username = userLogged.username;
                            socket.user.onlineTime = userLogged.onlineTime;

                            socket.user.token = token;
                            socket.user.refreshToken = refreshToken;

                            console.log('success reconnectUserByRefreshToken : ' + socket.user.name);
                            next();

                        }).catch(err => {
                            console.log(err);
                            if (err == consts.CONNECTION_ERR_REFRESH_TOKEN_EXPIRED) {
                                next(new Error(consts.CONNECTION_ERR_REFRESH_TOKEN_EXPIRED));
                            } else {
                                next(new Error(err));
                            }
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
                socket.emit(consts.ON_LOGGED, user, socket.user.token, socket.user.refreshToken);
                socket.broadcast.emit(consts.ON_USER_CAME, user);
            }
            socket.user.token = null;
            socket.user.refreshToken = null;

            userApi.listen(io, socket);
            chatApi.listen(io, socket);

            socket.on("disconnect", async () => {
                let user = socket.user
                let userUid = user.key.uid;
                const matchingSockets = await io.in(userUid).allSockets();
                const isDisconnected = matchingSockets.size === 0;

                let time = Date.now();
                UserDao.update({ uid: userUid, onlineTime: time })
                socket.broadcast.emit(consts.ON_ONLINE_TIME, socket.user.key.uid, time);

                UserDao.find(userUid).then(user => {
                    let roomUids = user.roomUids
                    if (roomUids) {
                        for (roomUid of roomUids) {
                            let room = roomsManager.updateOnlineMemberCount(roomUid, false);
                            io.emit(consts.ON_ROOM_ONLINE_MEMBER_COUNT,
                                roomUid, room.key.memberCount,
                                room.onlineMemberCount);
                        }
                    }
                }).catch(err => console.log(err))

                if (isDisconnected) {
                    usersManager.userList.remove(userUid);
                    socket.broadcast.emit(consts.ON_USER_LEFT, user);
                    console.log('disconnected : ' + user.name);
                }
            });

            socket.on(consts.ON_LOGOUT, () => {
                UserDao.logout(socket.user.key.uid, (roomUid, memberCount) => {
                    //onRemoveFromRoom
                    let room = roomsManager.updateMemberCount(roomUid, memberCount, false);
                    io.emit(consts.ON_ROOM_MEMBER_REMOVED, roomUid, memberCount, socket.user.name, room.onlineMemberCount);
                })
                    .then(oldUser => {
                        socket.emit(consts.ON_LOGOUT, true);
                        console.log('logout : ' + oldUser.name);
                    }).catch(err => {
                        console.log(err)
                        socket.emit(consts.ON_LOGOUT, false);
                    })
            });

            socket.on(consts.ON_REQUEST_REGISTER, (username, password) => {
                let user = socket.user;
                user.uid = socket.user.key.uid;
                usersManager.register(user, username, password).then(res => {
                    socket.emit(consts.ON_REQUEST_REGISTER, res.user, res.token, res.refreshToken)
                    io.emit(consts.ON_USER_LEFT, socket.user)
                    socket.user = res.user;
                    io.emit(consts.ON_USER_CAME, socket.user)
                }).catch(err => {
                    socket.emit(consts.ON_REQUEST_REGISTER, "", "", "")
                    console.log(err);
                })
            })
        });
    }
};
