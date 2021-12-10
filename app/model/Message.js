class Message {
    constructor(id, sender, receiverId, text) {
        this.id = id;
        this.sender = sender;
        this.receiverId = receiverId;
        this.text = text;
    }
}

module.exports = Message;