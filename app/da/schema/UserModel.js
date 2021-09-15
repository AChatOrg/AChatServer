const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true, unique: true, maxlength: 12 },
    password: { type: String, required: true },
    name: { type: String, required: true },
    bio: { type: String },
    gender: { type: Number }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;