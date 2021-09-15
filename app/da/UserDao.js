const UserModel = require('./schema/UserModel');
const User = require('../model/User');

module.exports = {
    save: function (user) {
        return new Promise((resolve, reject) => {
            let userDb = new UserModel({
                username: user.username,
                password: user.password,
                name: user.name,
                bio: user.bio,
                gender: user.gender
            });
            userDb.save((err, userSaved) => {
                if (err)
                    reject(err);
                else {
                    let userResult = new User(
                        userSaved._id,
                        userSaved.username,
                        userSaved.password,
                        userSaved.name,
                        userSaved.bio,
                        userSaved.gender
                    );
                    resolve(userResult);
                }
            });
        });
    }
}