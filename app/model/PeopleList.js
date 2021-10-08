const createTree = require('functional-red-black-tree');
const Map = require('hashmap');

class Tree {

    constructor() {
        this.map = new Map();
        this.tree = createTree((userAKey, userBKey) => {
            if (userAKey.id == userBKey.id
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
        this.map.set(user.key.id, user.key);
    }

    get(id) {
        let key = this.map.get(id);
        if (key) {
            return this.tree.get(key);
        }
    }

    remove(id) {
        let key = this.map.get(id);
        if (key) {
            this.tree = this.tree.remove(key);
            this.map.delete(id);
        }
    }

    update(id, newUser) {
        let oldUser = this.get(id);
        if (oldUser) {
            oldUser.update(newUser);
            this.map.delete(id);
            this.map.set(newUser.key.id, newUser.key);
        }
    }

    exist(id) {
        let hasKey = this.map.has(id);
        if (hasKey) {
            let user = this.get(id);
            if (user) return true;
        }
        return false;
    }
}

module.exports = Tree;