const usersManager = require('../bl/usersManager')

module.exports = {
    listen: function (socket) {
        socket.emit('people', usersManager.peopleList.list)

        socket.on('people', () => {
            socket.emit('people', usersManager.peopleList.list)
        })
    }
};
