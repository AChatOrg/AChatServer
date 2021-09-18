const createTree = require('functional-red-black-tree');
const Map = require('hashmap');

class Tree {
    constructor() {
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
        this.map = new Map();
    }
    add(user) {
        this.tree = this.tree.insert(user.key, user);
        this.map.set(user.key.ipv4, user.key);
    }
    get(ipv4) {
        let key = this.map.get(ipv4);
        return this.tree.get(key);
    }
    remove(ipv4) {
        let key = this.map.get(ipv4);
        this.tree = this.tree.remove(key);
        this.map.delete(ipv4);
    }

    list() {
        return this.tree.values;
    }
}

module.exports = Tree;