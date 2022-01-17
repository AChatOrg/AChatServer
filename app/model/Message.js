class Message {
    constructor(uid, sender, receiverUid, text) {
        this.uid = uid;
        this.sender = sender;
        this.receiverUid = receiverUid;
        this.text = text;
    }
}

module.exports = Message;