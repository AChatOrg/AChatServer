const usersManager = require('../bl/usersManager')
const consts = require('../config').consts;
const MessageDao = require('../da/MessageDao')
const ReadDao = require('../da/ReadDao')
const UserDao = require('../da/UserDao')

module.exports = {
    listen: function (socket) {
        socket.on(consts.ON_PV_MSG, json => {
            let message = JSON.parse(json)

            message.senderUid = socket.user.key.uid
            message.time = Date.now()
            socket.emit(consts.ON_MSG_SENT, message.uid)

            // MessageDao.save(message).catch(err => { })
            UserDao.addOfflineMessage(message)

            let receiver = usersManager.userList.get(message.receiverUid);
            if (receiver) {
                socket.to(message.receiverUid).to(message.senderUid).emit(consts.ON_PV_MSG, message);
            }
        })

        socket.on(consts.ON_MSG_RECEIVED, uid => {
            // MessageDao.delete(uid)
            UserDao.removeOfflineMessage(socket.user.key.uid, uid)
        })

        socket.on(consts.ON_MSG_READ, (uid, receiverUid) => {
            socket.emit(consts.ON_MSG_READ_RECEIVED, uid)
            // ReadDao.save(uid, receiverUid).catch(err => { })
            UserDao.addOfflineReadMessageUid(receiverUid, uid)
            socket.to(receiverUid).to(socket.user.key.uid).emit(consts.ON_MSG_READ, uid)
        })

        socket.on(consts.ON_MSG_READ_RECEIVED, uid => {
            // ReadDao.delete(uid)
            UserDao.removeOfflineReadMessageUid(socket.user.key.uid, uid)
        })

        socket.on(consts.ON_TYPING, receiverUid => {
            let senderUid = socket.user.key.uid
            socket.to(receiverUid).to(senderUid).emit(consts.ON_TYPING, senderUid)
        })
    },

    sendOfflineMessages: function (socket, receiverUid) {
        // MessageDao.find(receiverUid).then(messages => {
        //     let receiver = usersManager.userList.get(receiverUid);
        //     if (receiver) {
        //         for (let message of messages) {
        //             socket.emit(consts.ON_PV_MSG, message);
        //         }
        //     }
        // })
        UserDao.getOfflineMessages(receiverUid).then(messages => {
            if (messages) {
                let receiver = usersManager.userList.get(receiverUid);
                if (receiver) {
                    for (let message of messages) {
                        socket.emit(consts.ON_PV_MSG, message);
                    }
                }
            }
        })
    },

    sendOfflineMessageReads: function (socket, receiverUid) {
        // ReadDao.find(receiverUid).then(reads => {
        //     let receiver = usersManager.userList.get(receiverUid);
        //     if (receiver) {
        //         for (let read of reads) {
        //             socket.emit(consts.ON_MSG_READ, read.uid);
        //         }
        //     }
        // })
        UserDao.getOfflineReadMessageUids(receiverUid).then(uids => {
            if (uids) {
                let receiver = usersManager.userList.get(receiverUid);
                if (receiver) {
                    for (let uid of uids) {
                        socket.emit(consts.ON_MSG_READ, uid);
                    }
                }
            }
        })
    }
}