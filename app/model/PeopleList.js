const createTree = require('functional-red-black-tree');
const Map = require('hashmap');

class Tree {

    constructor() {
        this.map = new Map();
        this.tree = createTree((userAKey, userBKey) => {
            if (userAKey.uuid == userBKey.uuid
                && userAKey.rank == userBKey.rank
                && userAKey.score == userBKey.score
                && userAKey.loginTime == userBKey.loginTime) return 0;
            if (userAKey.rank < userBKey.rank) return 1;
            if (userAKey.rank > userBKey.rank) return -1;
            if (userAKey.score < userBKey.score) return 1;
            if (userAKey.score > userBKey.score) return -1;
            if (userAKey.loginTime < userBKey.loginTime) return -1;
            if (userAKey.loginTime > userBKey.loginTime) return 1;
        });
    }

    list() {
        return this.tree.values;
    }

    add(user) {
        this.tree = this.tree.insert(user.key, user);
        this.map.set(user.key.uuid, user.key);
    }

    get(uuid) {
        let key = this.map.get(uuid);
        if (key) {
            return this.tree.get(key);
        }
    }

    remove(uuid) {
        let key = this.map.get(uuid);
        if (key) {
            this.tree = this.tree.remove(key);
            this.map.delete(uuid);
        }
    }

    update(uuid, newUser) {
        let oldUser = this.get(uuid);
        if (oldUser) {
            oldUser.update(newUser);
            this.map.delete(uuid);
            this.map.set(newUser.key.uuid, newUser.key);
        }
    }

    exist(uuid) {
        let hasKey = this.map.has(uuid);
        if (hasKey) {
            let user = this.get(uuid);
            if (user) return true;
        }
        return false;
    }
}

module.exports = Tree;