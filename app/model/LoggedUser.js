const OnlineUser = require('./OnlineUser');

class LoggedUser extends OnlineUser {

    constructor(id, username, password, name, avatar, bio, gender, rank) {
        super(id, name, avatar, bio, gender, rank);
        this.username = username;
        this.password = password;
    }
}

module.exports = LoggedUser;