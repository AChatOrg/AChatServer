const UserDao = require('../da/UserDao');
const RoomList = require('../model/RoomList');
const Room = require('../model/Room').Room;
const consts = require('../config').consts
const RoomDao = require('../da/RoomDao')

const roomList = new RoomList();
const mainRoom = new Room(consts.MAIN_ROOM_UID, 1000, "اتاق اصلی", 100, consts.GENDER_MIXED, ['https://i.pravatar.cc/150?img=' + Math.random(), 'https://i.pravatar.cc/150?img=' + Math.random(), 'https://i.pravatar.cc/150?img=' + Math.random()])

//////////////////////////
RoomDao.put(mainRoom).catch(err => { console.log(err);})
RoomDao.findAll().then(rooms=>{
    for (r of rooms) {
        let room = new Room(r.uid, r.members.length, r.name, 0, r.gender, r.avatars);
        roomList.add(room);
    }
})
.catch(err=>{console.log(err);})
//////////////////////////

module.exports = {

    roomList: roomList,
}