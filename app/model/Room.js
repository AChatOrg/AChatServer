

class Key {
    constructor(uid, memberCount) {
        this.uid = uid;
        this.memberCount = memberCount;
    }
}

class Room {
    constructor(uid, memberCount, name, onlineMemberCount, gender, avatars) {
        this.name = name;
        this.onlineMemberCount = onlineMemberCount;
        this.gender = gender;
        this.avatars = avatars;
        this.key = new Key(uid, memberCount)
    }

    update(newRoom) {
        this.name = newRoom.name;
        this.onlineMemberCount = newRoom.onlineMemberCount;
        this.gender = newRoom.gender;
        this.avatars = newRoom.avatars;
        this.key.uid = newRoom.key.uid;
        this.key.memberCount = newRoom.key.memberCount;
    }
}

module.exports = {Room, Key};