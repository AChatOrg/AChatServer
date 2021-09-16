
class OnlineUser {

    constructor(ipv4, name, avatar, bio, gender, rank, loginTime) {
        this.ipv4 = ipv4;
        this.name = name;
        this.avatar = avatar;
        this.bio = bio;
        this.gender = gender;
        this.rank = rank;
        this.loginTime = loginTime;
    }
}

module.exports = OnlineUser;