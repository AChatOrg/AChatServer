class Message {
    constructor(uid, sender, receiverId, text) {
        this.uid = uid;
        this.sender = sender;
        this.receiverId = receiverId;
        this.text = text;
    }
}

module.exports = Message;