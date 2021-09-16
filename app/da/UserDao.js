const UserModel = require('./schema/UserModel');
const LoggedUser = require('../model/LoggedUser');

module.exports = {
    save: function (user) {
        return new Promise((resolve, reject) => {
            let userDb = new UserModel({
                username: user.username,
                password: user.password,
                avatar: user.avatar,
                bio: user.bio,
                gender: user.gender,
                rank: user.rank
            });
            userDb.save((err, userSaved) => {
                if (err)
                    reject(err);
                else {
                    let userResult = new LoggedUser(
                        userSaved._id,
                        userSaved.username,
                        undefined,
                        userSaved.avatar,
                        userSaved.bio,
                        userSaved.gender,
                        userSaved.rank
                    );
                    resolve(userResult);
                }
            });
        });
    }
}