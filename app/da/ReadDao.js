const ReadModel = require('./schema/ReadModel');

module.exports = {
    save: function (uid, receiverUid) {
        return new Promise((resolve, reject) => {
            let readDb = new ReadModel({
                uid: uid,
                receiverUid: receiverUid,
            });
            readDb.save((err, readSaved) => {
                if (err)
                    reject(err);
                else {
                    resolve(readSaved)
                }
            });
        });
    },

    find: function (receiverUid) {
        return new Promise((resolve, reject) => {
            ReadModel.find({ receiverUid: receiverUid }, function (err, readFound) {
                if (err)
                    reject(err);
                else
                    resolve(readFound);
            });
        });
    },

    delete: function (uid) {
        return new Promise((resolve, reject) => {
            ReadModel.deleteOne({ uid: uid }, function (err) {
                if (err)
                    reject(err)
                else
                    resolve()
            })
        })
    }
}