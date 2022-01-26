const mongoose = require('mongoose');

const ReadSchema = new mongoose.Schema({
    uid: { type: String, required: true, index: true, unique: true },
    receiverUid: { type: String, required: true },
});

// const RaedModel = mongoose.model('Read', ReadSchema);

// module.exports = RaedModel;