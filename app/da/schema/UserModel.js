const mongoose = require('mongoose');
const consts = require('../../config').consts

const userSchema = new mongoose.Schema({
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
    onlineTime: { type: Number, default: 0 }
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;