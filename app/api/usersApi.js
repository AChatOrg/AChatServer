const usersManager = require('../bl/usersManager')
const consts = require('../config').consts;

module.exports = {
    listen: function (socket) {
        socket.on(consts.ON_USERS, () => {
            socket.emit(consts.ON_USERS, usersManager.userList.list())
        })

        socket.on(consts.ON_ONLINE_TIME, isOnline => {
            let time = (isOnline ? 0 : Date.now())
            usersManager.updateUserOnlineTime(socket.user.key.uid, { onlineTime: time })
            socket.broadcast.emit(consts.ON_ONLINE_TIME, socket.user.key.uid, time);
        })
    }
};
