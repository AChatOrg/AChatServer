const usersManager = require('../bl/usersManager')
const consts = require('../config').consts;
const MessageDao = require('../da/MessageDao')

module.exports = {
    listen: function (socket) {
        socket.on(consts.ON_PV_MSG, json => {
            let message = JSON.parse(json)

            message.senderUid = socket.people.key.uid
            message.time = Date.now()
            socket.emit(consts.ON_MSG_SENT, message.uid)

            MessageDao.save(message)

            let receiver = usersManager.peopleList.get(message.receiverUid);
            if (receiver) {
                socket.to(message.receiverUid).to(message.senderUid).emit(consts.ON_PV_MSG, message);
            }
        })

        socket.on(consts.ON_MSG_RECEIVED, uid => {
            MessageDao.delete(uid)
        })

        socket.on(consts.ON_MSG_READ, (uid, senderUid) => {
            socket.to(senderUid).to(socket.people.key.uid).emit(consts.ON_MSG_READ, uid)
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
    }
}