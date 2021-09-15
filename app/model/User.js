const Thing = require('./Thing');

class User extends Thing {

    constructor(id, username, password, name, bio, gender) {
        super(id, name, bio, gender);
        this.username = username;
        this.password = password;
    }
}

module.exports = User;