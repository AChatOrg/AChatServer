const usersManager = require('../bl/usersManager')
const roomsManager = require('../bl/roomsManager')
const consts = require('../config').consts;
const RoomDao = require('../da/RoomDao')
const UserDao = require('../da/UserDao')

module.exports = {
    listen: function (socket) {
        socket.on(consts.ON_MSG, json => {
            let message = JSON.parse(json)

            message.senderUid = socket.user.key.uid
            message.time = Date.now()
            socket.emit(consts.ON_MSG_SENT, message.uid)

            if (message.chatType == consts.CHAT_TYPE_PV) {
                // MessageDao.save(message).catch(err => { })
                UserDao.addOfflineMessage(message.receiverUid, message)

                let receiver = usersManager.userList.get(message.receiverUid);
                if (receiver) {
                    socket.to(message.receiverUid).to(message.senderUid).emit(consts.ON_MSG, message);
                }
            } else if (message.chatType == consts.CHAT_TYPE_ROOM) {
                let room = roomsManager.roomList.get(message.receiverUid);
                if (room && (room.gender == consts.GENDER_MIXED || (room.gender == socket.user.gender))) {
                    RoomDao.addMemberIfNotExist(message.receiverUid, socket.user)
                    UserDao.addRoomUidIfNotExist(message.senderUid, message.receiverUid)
                    RoomDao.addOfflineMessage(message)
                    socket.to(message.receiverUid).emit(consts.ON_MSG, message);
                }
            }
        })

        socket.on(consts.ON_MSG_RECEIVED, (uid, isPvMessage, receiverUid) => {
            // MessageDao.delete(uid)
            if (isPvMessage) {
                UserDao.removeOfflineMessage(socket.user.key.uid, uid)
            } else {
                RoomDao.removeOfflineMessage(receiverUid, uid)
            }
        })

        socket.on(consts.ON_MSG_READ, (uid, receiverUid, isPvMessage) => {
            socket.emit(consts.ON_MSG_READ_RECEIVED, uid)
            // ReadDao.save(uid, receiverUid).catch(err => { })
            if (isPvMessage) {
                UserDao.addOfflineReadMessageUid(receiverUid, uid)
                socket.to(receiverUid).to(socket.user.key.uid).emit(consts.ON_MSG_READ, uid)
            } else {
                RoomDao.addOfflineReadMessageUid(receiverUid, uid, socket.user.key.uid)
                socket.to(receiverUid).emit(consts.ON_MSG_READ, uid)
            }
        })

        socket.on(consts.ON_MSG_READ_RECEIVED, (uid, isPvMessage, receiverUid) => {
            // ReadDao.delete(uid)
            if (isPvMessage) {
                UserDao.removeOfflineReadMessageUid(socket.user.key.uid, uid)
            } else {
                RoomDao.removeOfflineReadMessageUid(receiverUid, uid)
            }
        })

        socket.on(consts.ON_TYPING, (receiverUid, isRoom) => {
            let senderUid = socket.user.key.uid
            if (isRoom) {
                socket.to(receiverUid).emit(consts.ON_TYPING, receiverUid, socket.user)
            } else {
                socket.to(receiverUid).to(senderUid).emit(consts.ON_TYPING, senderUid)
            }
        })

        socket.on(consts.ON_JOIN_LEAVE_ROOM, (roomUid, isJoinOrLeave) => {
            if (isJoinOrLeave) {
                let room = roomsManager.roomList.get(roomUid);
                if (room && (room.gender == consts.GENDER_MIXED || (room.gender == socket.user.gender))) {
                    socket.join(roomUid)
                }
            } else {
                socket.leave(roomUid)
            }
        })
    },

    sendOfflines: function (socket, receiverUid) {
        // MessageDao.find(receiverUid).then(messages => {
        //     let receiver = usersManager.userList.get(receiverUid);
        //     if (receiver) {
        //         for (let message of messages) {
        //             socket.emit(consts.ON_PV_MSG, message);
        //         }
        //     }
        // })
        UserDao.find(receiverUid).then(user => {
            if (user) {
                let u = usersManager.userList.get(receiverUid);
                if (u) {
                    for (let roomUid of user.roomUids) {
                        socket.join(roomUid)
                    }
                    for (let message of user.offlineMessages) {
                        socket.emit(consts.ON_MSG, message);
                    }
                    for (let uid of user.offlineReadMessageUids) {
                        socket.emit(consts.ON_MSG_READ, uid);
                    }
                }
            }
        })
    },
}