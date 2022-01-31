const UserModel = require('./schema/UserModel').UserModel;
const RoomDao = require('./RoomDao');

module.exports = {
    put: function (user) {
        return new Promise((resolve, reject) => {
            let query = { androidId: user.androidId },
                update = {
                    androidId: user.androidId,
                    username: user.username,

                    uid: user.key.uid,
                    loginTime: user.key.loginTime,

                    name: user.name,
                    bio: user.bio,
                    gender: user.gender,
                    avatars: user.avatars,
                    onlineTime: user.onlineTime,

                    $set: {
                        offlineMessages: user.offlineMessages,
                        offlineReadMessageUids: user.offlineReadMessageUids,
                        roomUids: user.roomUids,
                        friendUids: user.friendUids,
                        viewerUids: user.viewerUids

                    }
                },
                options = {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                };

            UserModel.findOneAndUpdate(query, update, options, (err, doc) => {
                if (err)
                    reject(err)
                else
                    resolve(doc)
            }).lean()
        })
    },

    update: function (user) {
        return new Promise((reslove, reject) => {
            options = { new: true, setDefaultsOnInsert: true };
            UserModel.findOneAndUpdate({ androidId: user.androidId }, user, options, (err, doc) => {
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
                if (err)
                    reject(err);
                else
                    resolve(userFound);
            })
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

    logout: function (user, onRemoveRoom) {
        return new Promise((resolve, reject) => {
            let query = { androidId: user.androidId },
                update = {
                    androidId: user.androidId,
                    uid: user.key.uid,
                    name: user.name,
                    viewsCount: 0,
                    likesCount: 0,
                    friendsCount: 0,
                    $set: {
                        offlineMessages: [],
                        offlineReadMessageUids: [],
                        roomUids: [],
                        friends: [],
                        viewers: [],
                        likerUids: []
                    }
                },
                options = {
                    setDefaultsOnInsert: true,
                };

            UserModel.findOneAndUpdate(query, update, options, (err, oldUser) => {
                if (err)
                    reject(err)
                else {
                    let roomUids = oldUser.roomUids;
                    if (roomUids) {
                        for (roomUid of roomUids) {
                            RoomDao.removeMemberUid(roomUid, oldUser.uid, onRemoveRoom)
                        }
                    }
                    resolve(oldUser)
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
    }
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