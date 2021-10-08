const loginManager = require('../bl/loginManager')

module.exports = {
    listen: function (socket) {
        socket.emit('people', loginManager.getUsers())

        socket.on('people', () => {
            socket.emit('people', loginManager.getUsers())
        })
    }
};
