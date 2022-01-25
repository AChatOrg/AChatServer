const mongoose = require('mongoose');
const consts = require('../../config').consts
const messageSchema = require('./MessageModel').messageSchema

const userSchema = new mongoose.Schema({
    androidId: { type: String, required: true, unique: true, index: true },
    username: { type: String, index: true, unique: true },
    passwordHash: { type: String },

    uid: { type: String, required: true, unique: true, index: true },
    rank: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    loginTime: { type: Number, default: 0 },

    name: { type: String, required: true },
    bio: { type: String, default: '' },
    gender: { type: Number, default: consts.GENDER_MALE },
    avatars: { type: [String] },
    onlineTime: { type: Number, default: 0 },

    offlineMessages: [messageSchema],

    offlineReadMessageUids: [{ type: String, required: true, index: true }],

    roomUids: [{ type: String, index: true}]
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel, userSchema};