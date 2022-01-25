

class Key {
    constructor(uid, memberCount, createTime) {
        this.uid = uid;
        this.memberCount = memberCount;
        this.createTime = createTime;
    }
}

class Room {
    constructor(uid, memberCount, createTime, name, onlineMemberCount, gender, avatars) {
        this.name = name;
        this.onlineMemberCount = onlineMemberCount;
        this.gender = gender;
        this.avatars = avatars;
        this.key = new Key(uid, memberCount, createTime)
    }

    update(newRoom) {
        this.name = newRoom.name;
        this.onlineMemberCount = newRoom.onlineMemberCount;
        this.gender = newRoom.gender;
        this.avatars = newRoom.avatars;
        this.key.uid = newRoom.key.uid;
        this.key.memberCount = newRoom.key.memberCount;
        this.ket.createTime = newRoom.key.createTime;
    }
}

module.exports = { Room, Key };