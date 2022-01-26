const createTree = require('functional-red-black-tree');
const Map = require('hashmap');

class Tree {

    constructor() {
        this.map = new Map();
        this.tree = createTree((roomAKey, roomBKey) => {
            if (roomAKey.uid == roomBKey.uid
                && roomAKey.memberCount == roomBKey.memberCount) return 0;
            if (roomAKey.memberCount < roomBKey.memberCount) return 1;
            if (roomAKey.memberCount > roomBKey.memberCount) return -1;
            if (roomAKey.createTime < roomBKey.createTime) return -1;
            if (roomAKey.createTime > roomBKey.createTime) return 1;
            return 0;
        });
    }

    list() {
        return this.tree.values;
    }

    add(room) {
        this.tree = this.tree.insert(room.key, room);
        this.map.set(room.key.uid, room.key);
    }

    get(uid) {
        let key = this.map.get(uid);
        if (key) {
            return this.tree.get(key);
        }
    }

    remove(uid) {
        let key = this.map.get(uid);
        if (key) {
            this.tree = this.tree.remove(key);
            this.map.delete(uid);
        }
    }

    update(uid, newRoom) {
        let oldRoom = this.get(uid);
        if (oldRoom) {
            oldRoom.update(newRoom);
            this.map.delete(uid);
            this.map.set(newRoom.key.uid, newRoom.key);
        }
    }

    updateMemberCount(uid, memberCount) {
        let oldRoom = this.get(uid);
        if (oldRoom) {
            oldRoom.key.memberCount = memberCount;
            this.map.delete(uid);
            this.map.set(uid, oldRoom.key);
        }
    }

    exist(uid) {
        let hasKey = this.map.has(uid);
        if (hasKey) {
            let room = this.get(uid);
            if (room) return true;
        }
        return false;
    }
}

module.exports = Tree;