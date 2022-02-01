const UserModel = require('./schema/UserModel').UserModel;
const RoomDao = require('./RoomDao');

module.exports = {
    save: function (user) {
        return new Promise((resolve, reject) => {
            let userModel = new UserModel({
                androidId: user.androidId,
                username: user.username,

                uid: user.key.uid,
                rank: user.key.rank,
                score: user.key.score,
                loginTime: user.key.loginTime,

                name: user.name,
                bio: user.bio,
                gender: user.gender,
            });

            userModel.save((err, savedUser) => {
                if (err)
                    reject(err)
                else
                    resolve(savedUser)
            })
        })
    },

    update: function (user) {
        return new Promise((reslove, reject) => {
            options = { new: true, setDefaultsOnInsert: true };
            UserModel.findOneAndUpdate({ uid: user.uid }, user, options, (err, doc) => {
                if (err)
                    reject(err)
                else
                    reslove(doc)
            }).lean()
        })
    },

    addOfflineMessage: function (receiverUid, message) {
        let query = { uid: receiverUid },
            update = {
                $push: { offlineMessages: message },
            };

        UserModel.findOneAndUpdate(query, update, { setDefaultsOnInsert: true }, (err, res) => { })
    },

    removeOfflineMessage: function (senderUid, messageUid) {
        let query = { uid: senderUid },
            update = {
                $pull: { offlineMessages: { uid: messageUid } },
            };

        UserModel.findOneAndUpdate(query, update, (err, res) => { })
    },

    find: function (uid) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ uid: uid }, (err, userFound) => {
                if (err || !userFound)
                    reject(err);
                else
                    resolve(userFound);
            })
        })
    },

    findByUsername: function (username) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username: username }, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            }).lean()
        })
    },

    addOfflineReadMessageUid: function (receiverUid, messageUid) {
        let query = { uid: receiverUid },
            update = {
                $push: { offlineReadMessageUids: messageUid },
            };

        UserModel.findOneAndUpdate(query, update, { setDefaultsOnInsert: true }, (err, res) => { })
    },

    removeOfflineReadMessageUid: function (senderUid, messageUid) {
        let query = { uid: senderUid },
            update = {
                $pull: { offlineReadMessageUids: messageUid },
            };

        UserModel.findOneAndUpdate(query, update, (err, res) => { })
    },

    // getOfflineReadMessageUids: function (receiverUid) {
    //     return new Promise((resolve, reject) => {
    //         UserModel.findOne({ uid: receiverUid }, (err, userFound) => {
    //             if (err)
    //                 reject(err);
    //             else
    //                 resolve(userFound.offlineReadMessageUids);
    //         })
    //     })
    // },

    findAllByUid: function (uidArray) {
        return new Promise((resolve, reject) => {
            UserModel.find({ uid: { $in: uidArray } }, (err, userList) => {
                if (err)
                    reject(err)
                else
                    resolve(userList)
            })
        })
    },

    addRoomUidIfNotExist: function (userUid, roomUid) {
        UserModel.findOne({ uid: userUid }, (err, userFound) => {
            if (!err && userFound) {
                if (!userFound.roomUids.includes(roomUid)) {
                    userFound.roomUids.push(roomUid)
                    userFound.save()
                }
            }
        })
    },

    removeRoomUid: function (userUid, roomUid) {
        let query = { uid: userUid },
            update = {
                $pull: { roomUid: roomUid },
            };

        UserModel.findOneAndUpdate(query, update, (err, res) => { })
    },

    logout: function (uid, onRemoveRoom) {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndDelete({ uid: uid }, (err, deletedUser) => {
                if (err)
                    reject(err)
                else {
                    let roomUids = deletedUser.roomUids;
                    if (roomUids) {
                        for (roomUid of roomUids) {
                            RoomDao.removeMemberUid(roomUid, deletedUser.uid, onRemoveRoom)
                        }
                    }
                    resolve(deletedUser)
                }
            }).lean()
        })
    },

    addViewer: function (userUid, userViewer) {
        if (userUid != userViewer.key.uid) {
            let viewer = {
                uid: userViewer.key.uid,
                name: userViewer.name,
                rank: userViewer.key.rank,
                avatars: userViewer.avatars
            }
            UserModel.findOne({ uid: userUid }, (err, user) => {
                if (!err && user) {
                    let viewers = user.viewers.filter(u => u.uid != viewer.uid)
                    if (viewers.length == user.viewers.length)
                        user.viewsCount = user.viewsCount + 1;
                    viewers.unshift(viewer);
                    if (viewers.length > 10) {
                        viewers.pop()
                    }
                    user.viewers = viewers;
                    user.save()
                }
            })
        }
    },

    addFriend: function (userUid, friendUser) {
        if (userUid != friendUser.key.uid) {
            let friend = {
                uid: friendUser.key.uid,
                name: friendUser.name,
                rank: friendUser.key.rank,
                avatars: friendUser.avatars
            }
            UserModel.findOne({ uid: userUid }, (err, user) => {
                if (!err && user) {
                    if (!user.friends.some(u => u.uid == friend.uid)) {
                        user.friends.push(friend)
                        user.save()
                    }
                }
            })
        }
    },

    likeUser: function (userUid, requesterUid) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ uid: userUid }, (err, user) => {
                if (!err && user) {
                    if (removeFromArrayIfExist(user.likerUids, requesterUid)) {
                        user.likesCount = user.likesCount - 1;
                        user.save()
                        resolve([-1, user.likerUids.length])
                    } else {
                        user.likerUids.push(requesterUid);
                        user.likesCount = user.likesCount + 1;
                        user.save()
                        resolve([1, user.likerUids.length])
                    }
                } else {
                    reject(err)
                }
            })
        })
    },
}

function removeFromArrayIfExist(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
}