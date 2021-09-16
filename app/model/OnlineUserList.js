const HashMap = require('hashmap');
const map = new HashMap();

module.exports = {

    list: function () {
        return map.values();
    },

    add: function (user) {
        map.set(user.ipv4, user);
    },

    get: function (ipv4) {
        return map.get(ipv4);
    },

    remove: function (ipv4) {
        map.delete(ipv4);
    },

    exist: function (ipv4) {
        return map.has(ipv4);
    }
}