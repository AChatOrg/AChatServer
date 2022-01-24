
class Key {
    constructor(uid, rank, score, loginTime) {
        this.uid = uid;
        this.rank = rank;
        this.score = score;
        this.loginTime = loginTime;
    }
}

class User {

    constructor(name, bio, gender, avatars, uid, rank, score, loginTime) {
        this.name = name;
        this.bio = bio;
        this.gender = gender;
        this.avatars = avatars;
        this.key = new Key(uid, rank, score, loginTime);
    }

    update(newUser) {
        this.name = newUser.name;
        this.bio = newUser.bio;
        this.gender = newUser.gender;
        this.avatars = newUser.avatars;
        this.key.uid = newUser.key.uid;
        this.key.rank = newUser.key.rank;
        this.key.score = newUser.key.score;
        this.key.loginTime = newUser.key.loginTime;
    }
}

module.exports = { User, Key };