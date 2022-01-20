const MessageModel = require('./schema/MessageModel');

module.exports = {
    save: function (message) {
        return new Promise((resolve, reject) => {
            let messageDb = new MessageModel({
                uid: message.uid,
                type: message.type,
                transfer: message.transfer,
                time: message.time,
                text: message.text,
                extraTextSize: message.extraTextSize,
                mediaPath: message.mediaPath,

                receiverUid: message.receiverUid,

                senderUid: message.senderUid,
                senderRank: message.senderRank,
                senderScore: message.senderScore,
                senderLoginTime: message.senderLoginTime,
                senderName: message.senderName,
                senderBio: message.senderBio,
                senderGender: message.senderGender,
                senderAvatars: message.senderAvatars,
                senderOnlineTime: message.senderOnlineTime,

                delivery: message.delivery,
                bubble: message.bubble,

                id: message.id
            });
            messageDb.save((err, messageSaved) => {
                if (err)
                    reject(err);
                else {
                    resolve(messageSaved)
                }
            });
        });
    },

    find: function (receiverUid) {
        return new Promise((resolve, reject) => {
            MessageModel.find({ receiverUid: receiverUid }, function (err, messagesFound) {
                if (err)
                    reject(err);
                else
                    resolve(messagesFound);
            });
        });
    },

    delete: function (uid) {
        return new Promise((resolve, reject) => {
            MessageModel.deleteOne({ uid: uid }, function (err) {
                if (err)
                    reject(err)
                else
                    resolve()
            })
        })
    }
}