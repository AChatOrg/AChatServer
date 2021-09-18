const HashMap = require('hashmap');
const map = new HashMap();

module.exports = {

    list: function () {
        let values = map.values();
        values.sort((userA, userB) => {
            if (userA.rank < userB.rank) return 1;
            if (userA.rank > userB.rank) return -1;
            if (userA.score < userB.score) return 1;
            if (userA.score > userB.score) return -1;
            if (userA.loginTime < userB.loginTime) return -1;
            if (userA.loginTime > userB.loginTime) return 1;
            if (userA.ipv4 == userB.ipv4) return 0;
        });
        return values;
    },

    add: function (user) {
        map.set(user.ipv4, user);
    },

    remove: function (ipv4) {
        map.delete(ipv4);
    },

    get: function (ipv4) {
        return map.get(ipv4);
    },

    exist: function (ipv4) {
        return map.has(ipv4);
    }
}