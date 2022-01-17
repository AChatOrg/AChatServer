const usersManager = require('../bl/usersManager')
const operations = require('../config').operations;

module.exports = {
    listen: function (socket) {
        socket.on(operations.ON_USERS, () => {
            socket.emit(operations.ON_USERS, usersManager.peopleList.list())
        })
    }
};
