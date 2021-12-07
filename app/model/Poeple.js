
class Key {
    constructor(uuid, rank, score, loginTime) {
        this.uuid = uuid;
        this.rank = rank;
        this.score = score;
        this.loginTime = loginTime;
    }
}

class Avatar {
    constructor(url, isOnline) {
        this.url = url;
        this.isOnline = isOnline;
    }
}

class People {

    constructor(name, bio, gender, avatarUrl, isOnline, uuid, rank, score, loginTime) {
        this.name = name;
        this.bio = bio;
        this.gender = gender;
        this.avatar = new Avatar(avatarUrl, isOnline);
        this.key = new Key(uuid, rank, score, loginTime);
    }

    update(newUser) {
        this.name = newUser.name;
        this.bio = newUser.bio;
        this.gender = newUser.gender;
        this.avatar.avatarUrl = newUser.avatar.avatarUrl;
        this.avatar.isOnline = newUser.avatar.isOnline;
        this.key.uuid = newUser.key.uuid;
        this.key.rank = newUser.key.rank;
        this.key.score = newUser.key.score;
        this.key.loginTime = newUser.key.loginTime;
    }
}

module.exports = { People, Key };