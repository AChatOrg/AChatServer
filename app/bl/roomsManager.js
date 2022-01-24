const UserDao = require('../da/UserDao');
const RoomList = require('../model/RoomList');
const Room = require('../model/Room').Room;

const roomList = new RoomList();

//////////////////////////
for (let i = 0; i < 5; i++) {
    let rand = Math.random()
    let room = new Room(i, Math.floor(rand * 100), "name " + i, i, rand < 0.2 ? 1 : rand < 0.4 ? 2 : 3, ['https://i.pravatar.cc/150?img=' + Math.random(), 'https://i.pravatar.cc/150?img=' + Math.random(), 'https://i.pravatar.cc/150?img=' + Math.random()]);
    roomList.add(room);
}
//////////////////////////

module.exports = {

    roomList: roomList,

    putUser: function (user) {
        return new Promise((resolve, reject) => {
            UserDao.put(user).then(userResult => {
                resolve(userResult);
            }).catch(err => {
                reject(err)
            })
        })
    },

    updateUser: function (user) {
        return new Promise((resolve, reject) => {
            UserDao.update(user).then(userResult => {
                resolve(userResult);
            }).catch(err => {
                reject(err)
            })
        })
    },

    addUserIfNotExist: function (user) {
        if (roomList.exist(user.key.uid)) {
            return false;
        }
        roomList.add(user);
        return true;
    },

    update: function (user) {
        roomList.update(user.key.uid, user)
    },

    register: function (user) {
        return new Promise((resolve, reject) => {
            UserDao.save(user)
                .then(userSaved => {
                    resolve(userSaved);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}