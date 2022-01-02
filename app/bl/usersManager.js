const UserDao = require('../da/UserDao');
const PeopleList = require('../model/PeopleList');
const People = require('../model/Poeple').People;

const peopleList = new PeopleList();

//////////////////////////
for (let i = 0; i < 10; i++) {
    let user = new People("name " + i, "bio " + i, Math.random() < 0.5 ? 1 : 2, ['https://i.pravatar.cc/150?img='+Math.random()], i, Math.floor(Math.random() * (6 - 0 + 1) + 0), i, i);
    peopleList.add(user);
}
//////////////////////////

module.exports = {

    peopleList,

    createGuest: function (uid, name, bio, gender) {
        let people = new People(name, bio, gender, [], uid, 6, 0, Date.now());
        return people;
    },

    addPeopleIfNotExist: function (people) {
        if (peopleList.exist(people.key.uid)) {
            return false;
        }
        peopleList.add(people);
        return true;
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