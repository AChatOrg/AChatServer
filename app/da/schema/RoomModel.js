const mongoose = require('mongoose');
const userSchema = require('./UserModel').userSchema

const RoomSchema = new mongoose.Schema({
    uid: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    gender: { type: Number, required: true },
    avatars: { type: [String] },

    members: [userSchema],

}, {
    timestamps: true
});

const RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;