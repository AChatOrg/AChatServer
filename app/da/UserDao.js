const UserModel = require('./schema/UserModel');

module.exports = {
    put: function (user) {
        return new Promise((resolve, reject) => {
            let query = { uid: user.key.uid },
                update = {
                    username: user.username,

                    uid: user.key.uid,
                    loginTime: user.key.loginTime,

                    name: user.name,
                    bio: user.bio,
                    gender: user.gender,
                    avatars: user.avatars,
                    onlineTime: user.onlineTime
                },
                options = { upsert: true, new: true, setDefaultsOnInsert: true };

            UserModel.findOneAndUpdate(query, update, options, (err, doc) => {
                if (err)
                    reject(err)
                else
                    resolve(doc)
            }).lean()
        })
    },

    update: function (uid , user) {
        UserModel.updateOne({ uid: uid }, user);
    }
}