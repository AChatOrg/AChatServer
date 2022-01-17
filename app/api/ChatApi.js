const usersManager = require('../bl/usersManager')
const operations = require('../config').operations;
const { v4: uuidv4 } = require('uuid');

module.exports = {
    listen: function (socket) {
        socket.on(operations.ON_PV_MESSAGE, json => {
            let message = JSON.parse(json)

            message.time = Date.now()
            socket.emit(operations.ON_MESSAGE_SENT, message)

            let receiver = usersManager.peopleList.get(message.receiverUid);
            if (receiver) {
                socket.to(receiver.key.uid).to(socket.people.key.uid).emit(operations.ON_PV_MESSAGE, message);
            }
        })
    }
}