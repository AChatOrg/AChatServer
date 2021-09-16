const OnlineUser = require('./OnlineUser');

class LoggedUser extends OnlineUser {

    constructor(id, username, password, avatar, bio, gender, rank) {
        super(id, username, avatar, bio, gender, rank);
        this.password = password;
    }
}

module.exports = LoggedUser;