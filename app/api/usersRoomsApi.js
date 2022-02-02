const usersManager = require('../bl/usersManager')
const roomsManager = require('../bl/roomsManager')
const consts = require('../config').consts;
const UserDao = require('../da/UserDao')
const User = require('../model/User').User

module.exports = {
    listen: function (io, socket) {
        socket.on(consts.ON_USERS, () => {
            socket.emit(consts.ON_USERS, usersManager.userList.list())
        })

        socket.on(consts.ON_ONLINE_TIME, isOnline => {
            let time = (isOnline ? 0 : Date.now())
            let userUid = socket.user.key.uid;
            UserDao.update({ uid: userUid, onlineTime: time })
            socket.broadcast.emit(consts.ON_ONLINE_TIME, userUid, time);

            UserDao.find(userUid).then(user => {
                let roomUids = user.roomUids
                if (roomUids) {
                    for (roomUid of roomUids) {
                        let room = roomsManager.updateOnlineMemberCount(roomUid, isOnline);
                        io.emit(consts.ON_ROOM_ONLINE_MEMBER_COUNT,
                            roomUid, room.key.memberCount,
                            room.onlineMemberCount);
                    }
                }
            }).catch(err => console.log(err))
        })

        socket.on(consts.ON_ONLINE_TIME_CONTACTS, uidArray => {
            UserDao.findAllByUid(uidArray)
                .then(userList => {
                    let result = userList.map(user => JSON.stringify({
                        uid: user.uid,
                        name: user.name,
                        bio: user.bio,
                        gender: user.gender,
                        rank: user.rank,
                        avatars: user.avatars,
                        onlineTime: user.onlineTime,
                    }));
                    socket.emit(consts.ON_ONLINE_TIME_CONTACTS, result)
                })
                .catch(err => { console.log(err) })
        })

        socket.on(consts.ON_REQUEST_USER_INFO, userUid => {
            usersManager.getUserInfo(userUid, socket.user.key.uid).then(userInfo => {
                socket.emit(consts.ON_REQUEST_USER_INFO, "success", userInfo)
                UserDao.addViewer(userUid, socket.user)
            })
                .catch(err => {
                    socket.emit(consts.ON_REQUEST_USER_INFO, "notFound", "{}")
                })
        })


        socket.on(consts.ON_REQUEST_LIKE_USER, userUid => {
            UserDao.likeUser(userUid, socket.user.key.uid).then(result => {
                socket.emit(consts.ON_REQUEST_LIKE_USER, result[0], result[1])
            }).catch(err => {
                socket.emit(consts.ON_REQUEST_LIKE_USER, 0, 0)
            })
        })

        socket.on(consts.ON_REQUEST_EDIT_PROFILE, user => {
            user = JSON.parse(user)
            if (user.uid == socket.user.key.uid
                && (socket.user.key.rank != consts.RANK_GUEST || socket.user.username == user.username)
                && /^[a-zA-Z_][\w](?!.*?\.{2})[\w.]{1,28}[\w]$/.test(user.username)) {
                user.uid = socket.user.key.uid;
                UserDao.update(user).then(u => {
                    let usr = new User(u.name, u.bio, u.gender, u.avatars, u.uid, u.rank, u.score, u.loginTime, u.username)
                    socket.emit(consts.ON_REQUEST_EDIT_PROFILE, true, usr)
                    io.emit(consts.ON_USER_EDIT, usr)
                    usersManager.update(usr);
                }).catch(err => {
                    socket.emit(consts.ON_REQUEST_EDIT_PROFILE, false, new User())
                })
            } else {
                socket.emit(consts.ON_REQUEST_EDIT_PROFILE, false, new User())
            }
        })

        socket.on(consts.ON_REQUEST_CHECK_USERNAME, username => {
            UserDao.findByUsername(username).then(user => {
                socket.emit(consts.ON_REQUEST_CHECK_USERNAME, user != null)
            }).catch(err => {
                socket.emit(consts.ON_REQUEST_CHECK_USERNAME, false)
            })
        })

        socket.on(consts.ON_REQUEST_CHANGE_PASS, (currPass, newPass) => {
            usersManager.changePass(socket.user.key.uid, currPass, newPass).then(res => {
                socket.emit(consts.ON_REQUEST_CHANGE_PASS, res)
            }).catch(err => {
                socket.emit(consts.ON_REQUEST_CHANGE_PASS, err)
            })
        })
        //..................................................

        socket.on(consts.ON_ROOMS, () => {
            socket.emit(consts.ON_ROOMS, roomsManager.roomList.list())
        })

        socket.on(consts.ON_CREATE_ROOM, jsonRoom => {
            let room = JSON.parse(jsonRoom)
            roomsManager.createRoom(room, socket.user).then(createdRoom => {
                socket.emit(consts.ON_CREATE_ROOM, true);
                io.emit(consts.ON_ROOM_CREATE, createdRoom);
            }).catch(err => {
                console.log(err)
                socket.emit(consts.ON_CREATE_ROOM, false);
            })
        })

        socket.on(consts.ON_REQUEST_ROOM_MEMBER_COUNT, roomUid => {
            let room = roomsManager.getRoom(roomUid)
            if (room) {
                socket.emit(consts.ON_REQUEST_ROOM_MEMBER_COUNT, room.key.memberCount, room.onlineMemberCount)
            }
        })
    }
};
