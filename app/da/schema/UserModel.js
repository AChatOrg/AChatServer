const { Timestamp } = require('bson');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true, unique: true, maxlength: 12 },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    gender: { type: Number, required: true },
    score: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
}, {
    timestamps: true
}
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;