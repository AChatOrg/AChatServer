const UserDao = require('../da/UserDao');
const UserList = require('../model/UserList');
const User = require('../model/User').User;

const userList = new UserList();

//////////////////////////
for (let i = 0; i < 10; i++) {
    let user = new User("name " + i, "bio " + i, Math.random() < 0.5 ? 1 : 2, ['https://i.pravatar.cc/150?img=' + Math.random()], i, Math.floor(Math.random() * (6 - 0 + 1) + 0), i, i);
    userList.add(user);
}
//////////////////////////

module.exports = {

    userList,

    putUser: function (user) {
        return new Promise((resolve, reject) => {
            UserDao.put(user).then(userResult => {
                resolve(userResult);
            }).catch(err => {
                reject(err)
            })
        })
    },

    updateUserOnlineTime: function (uid, user) {
        UserDao.update(uid, user);
    },

    addUserIfNotExist: function (user) {
        if (userList.exist(user.key.uid)) {
            return false;
        }
        userList.add(user);
        return true;
    },

    update: function (user) {
        userList.update(user.key.uid, user)
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