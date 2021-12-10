const usersManager = require('../bl/usersManager')

module.exports = {
    listen: function (socket) {
        socket.on("pvMessage", message => {
            let receiver = usersManager.peopleList.get(message.receiverId);
            if (receiver) {
                socket.to(receiver.key.id).to(socket.people.key.id).emit(message);
            }
        })
    }
}