const UserModel = require('./schema/UserModel');

module.exports = {
    save: function (user) {
        return new Promise((resolve, reject) => {
            let userDb = new UserModel({
                username: user.username,
                password: user.password,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                gender: user.gender,
                score: user.score,
                rank: user.rank
            });
            userDb.save((err, userSaved) => {
                if (err)
                    reject(err);
                else {
                    // let userResult = new LoggedUser(
                    //     userSaved._id,
                    //     userSaved.username,
                    //     undefined,
                    //     userSaved.name,
                    //     userSaved.avatar,
                    //     userSaved.bio,
                    //     userSaved.gender,
                    //     userSaved.score,
                    //     userSaved.rank
                    // );
                    // resolve(userResult);
                }
            });
        });
    }
}