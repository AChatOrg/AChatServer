const usersManager = require('../bl/usersManager')
const consts = require('../config').consts;

module.exports = {
    listen: function (socket) {
        socket.on(consts.ON_USERS, () => {
            socket.emit(consts.ON_USERS, usersManager.peopleList.list())
        })
    }
};
