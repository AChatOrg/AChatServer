const usersManager = require('../bl/usersManager')

module.exports = {
    listen: function (socket) {
        socket.on("pvMessage", json => {
            let message = JSON.parse(json)
            let receiver = usersManager.peopleList.get(message.receiverId);
            if (receiver) {
                socket.to(receiver.key.uid).to(socket.people.key.uid).emit("pvMessage", message);
            }
        })
    }
}