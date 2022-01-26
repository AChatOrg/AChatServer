const mongoose = require('mongoose');
const userSchema = require('./UserModel').userSchema

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: Number, required: true },
    avatars: { type: [String] },

    uid: { type: String, required: true, index: true },
    createTime: { type: Number },

    isPv: { type: Boolean },

    members: [userSchema],

    memberUids: [String]
}, {
    timestamps: true
});

const RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;