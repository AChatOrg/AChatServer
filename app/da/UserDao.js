const UserModel = require('./schema/UserModel').UserModel;

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
                        roomUids: user.roomUids
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

    find: function (receiverUid) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ uid: receiverUid }, (err, userFound) => {
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
}