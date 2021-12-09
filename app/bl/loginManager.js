const UserDao = require('../da/UserDao');
const PeopleList = require('../model/PeopleList');
const People = require('../model/Poeple').People;

const peopleList = new PeopleList();

//////////////////////////
for (let i = 0; i < 10; i++) {
    let user = new People("name " + i, "bio " + i, Math.random() < 0.5 ? 1 : 2, "", true, i, Math.floor(Math.random() * (6 - 0 + 1) + 0), i, i);
    peopleList.add(user);
}
//////////////////////////

module.exports = {

    createGuest: function (ipv4, name, bio, gender) {
        let people = new People(name, bio, gender, '', true, ipv4, 6, 0, Date.now());
        return people;
    },

    addPeopleIfNotExist: function (people) {
        if (peopleList.exist(people.key.ipv4)) {
            return false;
        }
        peopleList.add(people);
        return true;
    },

    removePeople: function (ipv4) {
        peopleList.remove(ipv4);
    },

    getUsers: function () {
        return peopleList.list();
    },

    register: function (user) {
        return new Promise((resolve, reject) => {
            UserDao.save(user)
                .then(userSaved => {
                    resolve(userSaved);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}