
class Key {
    constructor(ipv4, rank, score, loginTime) {
        this.ipv4 = ipv4;
        this.rank = rank;
        this.score = score;
        this.loginTime = loginTime;
    }
}

class OnlineUser {

    constructor(ipv4, rank, score, loginTime, name, avatar, bio, gender) {
        this.key = new Key(ipv4, rank, score, loginTime);
        this.name = name;
        this.avatar = avatar;
        this.bio = bio;
        this.gender = gender;
    }
}

module.exports = { OnlineUser, Key };