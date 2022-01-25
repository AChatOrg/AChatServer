const RoomModel = require('./schema/RoomModel');
const UserDao = require('./UserDao')

module.exports = {
    put: function (room, members) {
        return new Promise((resolve, reject) => {
            let update = {
                $set: { members: members },

                uid: room.key.uid,
                createTime: room.key.createTime,
                
                name: room.name,
                gender: room.gender,
                avatars: room.avatars
            },
                options = {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                };
            RoomModel.findOneAndUpdate({ uid: room.key.uid }, update, options, (err, res) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        });
    },

    findAll: function () {
        return new Promise((resolve, reject) => {
            RoomModel.find((err, rooms) => {
                if (err)
                    reject(err)
                else
                    resolve(rooms)
            }).lean()
        });
    },

    delete: function (uid) {
        return new Promise((resolve, reject) => {
            RoomModel.deleteOne({ uid: uid }, function (err) {
                if (err)
                    reject(err)
                else
                    resolve()
            })
        })
    },

    addMember: function (uid, user) {
        let query = { uid: uid },
            update = {
                $push: { members: user },
            };

        RoomModel.findOneAndUpdate(query, update, (err, res) => { })
    },

    removeMember: function (uid, userUid) {
        let query = { uid: uid },
            update = {
                $pull: { members: { uid: userUid } },
            };

        RoomModel.findOneAndUpdate(query, update, (err, res) => { })
    },

    addMemberIfNotExist: function (roomUid, user) {
        RoomModel.findOne({ uid: roomUid }, (err, roomFound) => {
            if (!err && roomFound) {
                if (!roomFound.members.some(u => u.uid == user.key.uid)) {
                    let u = {
                        androidId: user.androidId,
                        username: user.username,

                        uid: user.key.uid,
                        rank: user.key.rank,
                        score: user.key.score,
                        loginTime: user.key.loginTime,

                        name: user.name,
                        bio: user.bio,
                        gender: user.gender,
                        avatars: user.avatars,
                        onlineTime: user.onlineTime
                    }
                    roomFound.members.push(u)
                    roomFound.save()
                }
            }
        })
    },

    addOfflineMessage: function (message) {
        RoomModel.findOne({ uid: message.receiverUid }, (err, room) => {
            if (err) console.log(err)
            else
                for (user of room.members) {
                    if (user.uid != message.senderUid)
                        UserDao.addOfflineMessage(user.uid, message);
                }
        })
    },

    addOfflineReadMessageUid: function (roomUid, messageUid, senderUid) {
        RoomModel.findOne({ uid: roomUid }, (err, room) => {
            if (err) console.log(err)
            else
                for (user of room.members) {
                    if (user.uid != senderUid)
                        UserDao.addOfflineReadMessageUid(user.uid, messageUid);
                }
        })
    },

    removeOfflineMessage: function (roomUid, messageUid) {
        RoomModel.findOne({ uid: roomUid }, (err, room) => {
            if (err) console.log(err)
            else
                for (user of room.members) {
                    UserDao.removeOfflineMessage(user.uid, messageUid);
                }
        })
    },

    removeOfflineReadMessageUid: function (roomUid, messageUid) {
        RoomModel.findOne({ uid: roomUid }, (err, room) => {
            if (err) console.log(err)
            else
                for (user of room.members) {
                    UserDao.removeOfflineReadMessageUid(user.uid, messageUid);
                }
        })
    },
}