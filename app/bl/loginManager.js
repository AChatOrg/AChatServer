const { v4: uuidv4 } = require('uuid');
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

    createGuest: function (name, bio, gender) {
        let uuid = uuidv4();
        let people = new People(name, bio, gender, '', true, uuid, 0, 0, Date.now());
        return people;
    },

    addPeople: function (people) {
        peopleList.add(people);
    },

    removePeople: function (uuid) {
        peopleList.remove(uuid);
    },

    getUsers: function(){
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