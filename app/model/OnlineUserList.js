const createTree = require('functional-red-black-tree');
const Map = require('hashmap');

class Tree {

    constructor() {
        this.map = new Map();
        this.tree = createTree((userAKey, userBKey) => {
            if (userAKey.ipv4 == userBKey.ipv4
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
        this.map.set(user.key.ipv4, user.key);
    }

    get(ipv4) {
        let key = this.map.get(ipv4);
        if (key) {
            return this.tree.get(key);
        }
    }

    remove(ipv4) {
        let key = this.map.get(ipv4);
        if (key) {
            this.tree = this.tree.remove(key);
            this.map.delete(ipv4);
        }
    }

    update(ipv4, newUser) {
        let oldUser = this.get(ipv4);
        if (oldUser) {
            oldUser.update(newUser);
            this.map.delete(ipv4);
            this.map.set(newUser.key.ipv4, newUser.key);
        }
    }

    exist(ipv4) {
        let hasKey = this.map.has(ipv4);
        if (hasKey) {
            let user = this.get(ipv4);
            if (user) return true;
        }
        return false;
    }
}

module.exports = Tree;