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
                avatars: room.avatars,
                isPv: room.isPv
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

    removeMember: function (roomUid, userUid, onRemove) {
        let query = { uid: roomUid },
            update = {
                $pull: { members: { uid: userUid } },
            };

        RoomModel.findOneAndUpdate(query, update, { new: true }, (err, room) => {
            if (!err && room) {
                onRemove(room.uid, room.memberUids.length)
            }
        }).lean()
    },

    removeMemberUid: function (roomUid, userUid, onRemove) {
        let query = { uid: roomUid },
            update = {
                $pull: { memberUids: userUid },
            };

        RoomModel.findOneAndUpdate(query, update, { new: true }, (err, room) => {
            if (!err && room) {
                onRemove(room.uid, room.memberUids.length)
            }
        }).lean()
    },

    addMemberIfNotExist: function (roomUid, user) {
        RoomModel.findOne({ uid: roomUid }, (err, roomFound) => {
            if (!err && roomFound) {
                if (!roomFound.members.some(u => u.uid == user.key.uid)) {
                    let u = {
                        uid: user.key.uid,
                        name: user.name,
                        bio: user.bio,
                        rank: user.key.rank,
                        avatars: user.avatars,
                    }
                    roomFound.members.push(u)
                    roomFound.save()
                }
            }
        })
    },

    addMemberUidIfNotExist: function (roomUid, userUid, onAdded) {
        RoomModel.findOne({ uid: roomUid }, (err, roomFound) => {
            if (!err && roomFound) {
                if (!roomFound.memberUids.some(uid => uid == userUid)) {
                    roomFound.memberUids.push(userUid)
                    roomFound.save()
                    onAdded(roomFound.memberUids.length)
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