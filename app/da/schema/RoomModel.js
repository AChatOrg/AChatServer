const mongoose = require('mongoose');
const consts = require('../../config').consts

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: Number, required: true },
    avatars: { type: [String] },

    uid: { type: String, required: true, index: true },
    createTime: { type: Number },

    isPv: { type: Boolean },

    members: [{
        uid: { type: String, require: true },
        name: { type: String, require: true },
        bio: { type: String},
        rank: { type: Number, default: consts.RANK_GUEST },
        avatars: [{ type: String }]
    }],

    memberUids: [String]
}, {
    timestamps: true
});

const RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;