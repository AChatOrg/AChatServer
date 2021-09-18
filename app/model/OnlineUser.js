
class Key {
    constructor(ipv4, rank, score, loginTime) {
        this.ipv4 = ipv4;
        this.rank = rank;
        this.score = score;
        this.loginTime = loginTime;
    }
}

class OnlineUser {

    constructor(ipv4, rank, score, loginTime, avatar, name, bio, gender) {
        this.key = new Key(ipv4, rank, score, loginTime);
        this.avatar = avatar;
        this.name = name;
        this.bio = bio;
        this.gender = gender;
    }

    update(newUser) {
        this.key.ipv4 = newUser.key.ipv4;
        this.key.rank = newUser.key.rank;
        this.key.score = newUser.key.score;
        this.key.loginTime = newUser.key.loginTime;
        this.name = newUser.name;
        this.avatar = newUser.avatar;
        this.bio = newUser.bio;
        this.gender = newUser.gender;
    }
}

module.exports = { OnlineUser, Key };