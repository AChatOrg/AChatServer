// const HashMap = require('hashmap');
// const map = new HashMap();

// module.exports = {

//     list: function () {
//         let values = map.values();
//         // values.sort((userAKey, userBKey) => {
//         //     if (userAKey.rank < userBKey.rank) return 1;
//         //     if (userAKey.rank > userBKey.rank) return -1;
//         //     if (userAKey.score < userBKey.score) return 1;
//         //     if (userAKey.score > userBKey.score) return -1;
//         //     if (userAKey.loginTime < userBKey.loginTime) return -1;
//         //     if (userAKey.loginTime > userBKey.loginTime) return 1;
//         //     if (userAKey.ipv4 == userBKey.ipv4) return 0;
//         // });
//         return values;
//     },

//     add: function (user) {
//         map.set(user.ipv4, user);
//     },

//     remove: function (ipv4) {
//         map.delete(ipv4);
//     },

//     get: function (ipv4) {
//         return map.get(ipv4);
//     },

//     exist: function (ipv4) {
//         return map.has(ipv4);
//     }
// }

const createTree = require('functional-red-black-tree');

var tree = createTree((userAKey, userBKey) => {
    if (userAKey.ipv4 == userBKey.ipv4) return 0;
    if (userAKey.rank < userBKey.rank) return 1;
    if (userAKey.rank > userBKey.rank) return -1;
    if (userAKey.score < userBKey.score) return 1;
    if (userAKey.score > userBKey.score) return -1;
    if (userAKey.loginTime < userBKey.loginTime) return -1;
    if (userAKey.loginTime > userBKey.loginTime) return 1;
});

function hash(ipv4, rank, score, loginTime){
    let hashCode;
    //How to implement?
    return hashCode;
}

module.exports = {

    list: function () {
        let values = tree.values;
        // values.sort((userAKey, userBKey) => {
        //     if (userAKey.rank < userBKey.rank) return 1;
        //     if (userAKey.rank > userBKey.rank) return -1;
        //     if (userAKey.score < userBKey.score) return 1;
        //     if (userAKey.score > userBKey.score) return -1;
        //     if (userAKey.loginTime < userBKey.loginTime) return -1;
        //     if (userAKey.loginTime > userBKey.loginTime) return 1;
        //     if (userAKey.ipv4 == userBKey.ipv4) return 0;
        // });
        return values;
    },

    add: function (user) {
        tree = tree.insert(user.key, user);
    },

    remove: function (ipv4) {
        map.delete(ipv4);
    },

    get: function (userKey) {
        return tree.get(userKey);
    },

    exist: function (ipv4) {
        return map.has(ipv4);
    }
}