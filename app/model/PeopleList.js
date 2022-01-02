const createTree = require('functional-red-black-tree');
const Map = require('hashmap');

class Tree {

    constructor() {
        this.map = new Map();
        this.tree = createTree((userAKey, userBKey) => {
            if (userAKey.uid == userBKey.uid
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
        this.map.set(user.key.uid, user.key);
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

    update(uid, newUser) {
        let oldUser = this.get(uid);
        if (oldUser) {
            oldUser.update(newUser);
            this.map.delete(uid);
            this.map.set(newUser.key.uid, newUser.key);
        }
    }

    exist(uid) {
        let hasKey = this.map.has(uid);
        if (hasKey) {
            let user = this.get(uid);
            if (user) return true;
        }
        return false;
    }
}

module.exports = Tree;