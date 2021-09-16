const HashMap = require('hashmap');
const map = new HashMap();

module.exports = {

    list: function () {
        return map.values();
    },

    add: function (user) {
        map.set(user.id, user);
    },

    get: function (id) {
        return map.get(id);
    },

    remove: function (id) {
        map.delete(id);
    }
}