
class LoggedUser {

    constructor(ipv4, username, password, name, avatar, bio, gender, score, rank) {
        this.ipv4 = ipv4;
        this.username = username;
        this.password = password;
        this.name = name;
        this.avatar = avatar;
        this.bio = bio;
        this.gender = gender;
        this.score = score;
        this.rank = rank;
    }
}

module.exports = LoggedUser;