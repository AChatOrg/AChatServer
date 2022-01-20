const usersManager = require('../bl/usersManager')
const consts = require('../config').consts;
const MessageDao = require('../da/MessageDao')
const ReadDao = require('../da/ReadDao')

module.exports = {
    listen: function (socket) {
        socket.on(consts.ON_PV_MSG, json => {
            let message = JSON.parse(json)

            message.senderUid = socket.people.key.uid
            message.time = Date.now()
            socket.emit(consts.ON_MSG_SENT, message.uid)

            MessageDao.save(message).catch(err => { })

            let receiver = usersManager.peopleList.get(message.receiverUid);
            if (receiver) {
                socket.to(message.receiverUid).to(message.senderUid).emit(consts.ON_PV_MSG, message);
            }
        })

        socket.on(consts.ON_MSG_RECEIVED, uid => {
            MessageDao.delete(uid)
        })

        socket.on(consts.ON_MSG_READ, (uid, receiverUid) => {
            socket.emit(consts.ON_MSG_READ_RECEIVED, uid)
            ReadDao.save(uid, receiverUid).catch(err => { })
            socket.to(receiverUid).to(socket.people.key.uid).emit(consts.ON_MSG_READ, uid)
        })

        socket.on(consts.ON_MSG_READ_RECEIVED, uid => {
            ReadDao.delete(uid)
        })

        socket.on(consts.ON_TYPING, receiverUid => {
            let senderUid = socket.people.key.uid
            socket.to(receiverUid).to(senderUid).emit(consts.ON_TYPING, senderUid)
        })
    },

    sendOfflineMessages: function (socket, receiverUid) {
        MessageDao.find(receiverUid).then(messages => {
            let receiver = usersManager.peopleList.get(receiverUid);
            if (receiver) {
                for (let message of messages) {
                    socket.emit(consts.ON_PV_MSG, message);
                }
            }
        })
    },

    sendOfflineRaeds: function (socket, receiverUid) {
        ReadDao.find(receiverUid).then(reads => {
            let receiver = usersManager.peopleList.get(receiverUid);
            if (receiver) {
                for (let read of reads) {
                    socket.emit(consts.ON_MSG_READ, read.uid);
                }
            }
        })
    }
}