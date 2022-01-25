const RoomList = require('../model/RoomList');
const Room = require('../model/Room').Room;
const consts = require('../config').consts
const RoomDao = require('../da/RoomDao')
const uuidv4 = require('uuid').v4

const roomList = new RoomList();
const mainRoom = new Room(consts.MAIN_ROOM_UID, 1000, 0, "اتاق اصلی", 100, consts.GENDER_MIXED, ['https://i.pravatar.cc/150?img=' + Math.random(), 'https://i.pravatar.cc/150?img=' + Math.random(), 'https://i.pravatar.cc/150?img=' + Math.random()])

//////////////////////////
RoomDao.put(mainRoom).catch(err => { console.log(err); })
RoomDao.findAll().then(rooms => {
    for (r of rooms) {
        let room = new Room(r.uid, r.members.length, r.createTime, r.name, 0, r.gender, r.avatars);
        roomList.add(room);
    }
})
    .catch(err => { console.log(err); })
//////////////////////////

module.exports = {

    roomList: roomList,

    createRoom: function (room, user) {
        return new Promise((resolve, reject) => {
            if (room.gender == consts.GENDER_MIXED || room.gender == user.gender) {
                let u = {
                    androidId: user.androidId,
                    username: user.username,

                    uid: user.key.uid,
                    loginTime: user.key.loginTime,

                    name: user.name,
                    bio: user.bio,
                    gender: user.gender,
                    avatars: user.avatars,
                    onlineTime: user.onlineTime
                }
                let rom = new Room(uuidv4(), 1, Date.now(), room.name, 1, room.gender, room.avatars)
                RoomDao.put(rom, [u]).then(r => {
                    let createdRoom = new Room(r.uid, r.members.length, r.createTime, r.name, 1, r.gender, r.avatars);
                    roomList.add(createdRoom)
                    resolve(createdRoom);
                })
                    .catch(err => reject(err));
            } else reject()
        })
    }
}