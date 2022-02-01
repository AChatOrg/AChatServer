const mongoose = require('mongoose');
const consts = require('../../config').consts
const messageSchema = require('./MessageModel').messageSchema

const userSchema = new mongoose.Schema({
    androidId: { type: String, required: true, index: true },
    username: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String },

    token: { type: String },
    tokenKey: { type: String },

    uid: { type: String, required: true, index: true, unique: true },
    rank: { type: Number, default: consts.RANK_GUEST },
    score: { type: Number, default: 0 },
    loginTime: { type: Number, default: 0 },

    name: { type: String, required: true },
    bio: { type: String, default: '' },
    gender: { type: Number, default: consts.GENDER_MALE },
    avatars: { type: [String] },
    onlineTime: { type: Number, default: consts.TIME_ONLINE },

    offlineMessages: [messageSchema],

    offlineReadMessageUids: [{ type: String, index: true }],

    roomUids: [{ type: String, index: true }],

    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    friendsCount: { type: Number, default: 0 },
    friends: [{
        uid: { type: String, require: true },
        name: { type: String, require: true },
        rank: { type: Number, default: 0 },
        avatars: [{ type: String }]
    }],
    viewers: [{
        uid: { type: String, require: true },
        name: { type: String, require: true },
        rank: { type: Number, default: 0 },
        avatars: [{ type: String }]
    }],

    likerUids: [String]
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel, userSchema };