const mongoose = require('mongoose');
const consts = require('../../config').consts;

const messageSchema = new mongoose.Schema({
    uid: { type: String, required: true, index: true },
    type: { type: Number, default: consts.MESSAGE_TYPE_TEXT },
    transfer: { type: Number, default: consts.TRANSFER_RECEIVE },
    time: { type: Number, default: 0 },
    text: { type: String, default: '' },
    extraTextSize: { type: Number, default: 0 },
    mediaPath: { type: String, default: '' },

    receiverUid: { type: String, required: true, index: true },

    senderUid: { type: String, required: true, index: true },
    senderRank: { type: Number, default: 0 },
    senderScore: { type: Number, default: 0 },
    senderLoginTime: { type: Number, default: 0 },
    senderName: { type: String, default: "" },
    senderBio: { type: String, default: "" },
    senderGender: { type: Number, default: consts.GENDER_MALE },
    senderAvatars: { type: [String] },
    senderOnlineTime: { type: Number, default: consts.TIME_ONLINE },

    chatType: { type: Number, default: consts.CHAT_TYPE_PV },

    delivery: { type: Number, default: consts.DELIVERY_WAITING },
    bubble: { type: Number, default: consts.BUBBLE_SINGLE },

    id: { type: Number, default: 0 }
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = { MessageModel, messageSchema };