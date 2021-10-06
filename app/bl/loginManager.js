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

    loginGuest: function (ipv4, name, bio, gender) {
        if (peopleList.exist(ipv4)) {
            return { logged: false, message: 'This user is online.' };
        } else {
            let people = new People(name, bio, gender, '', true, ipv4, 0, 0, Date.now());
            peopleList.add(people);
            return { logged: true, people: people };
        }
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