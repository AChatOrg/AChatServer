const UserDao = require('../da/UserDao');
const UserList = require('../model/UserList');
const User = require('../model/User').User;

const userList = new UserList();

const profileUsers = []
//////////////////////////
for (let i = 0; i < 10; i++) {
    let user = new User("name " + i, "bio " + i, Math.random() < 0.5 ? 1 : 2, ['https://i.pravatar.cc/150?img=' + Math.random()], i, Math.floor(Math.random() * (6 - 0 + 1) + 0), i, i);
    profileUsers.push({ uid: user.key.uid, name: user.name, rank: user.key.rank, avatars: user.avatars })
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
        if (userList.exist(user.key.uid)) {
            return false;
        }
        userList.add(user);
        return true;
    },

    update: function (user) {
        userList.update(user.key.uid, user)
    },

    getUserInfo: function (uid) {
        return new Promise((resolve, reject) => {
            UserDao.find(uid).then(user => {
                let userInfo = {
                    viewsCount: user.viewsCount,
                    likesCount: user.likesCount,
                    friendsCount: user.friendsCount,
                    friendList: profileUsers,
                    viewerList: profileUsers
                }
                resolve(userInfo)
            })
                .catch(err => reject(err))
        })
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