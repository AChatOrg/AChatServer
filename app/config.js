const port = 24240;
const mongodpServerUrl = 'mongodb://localhost/AChat';
const consts = {
    loginGuest: 'loginGuest',
    login: 'login',
    /*On login*/
    ON_LOGGED: 'logged',
    ON_USER_CAME: 'userCame',
    ON_USER_LEFT: 'userLeft',
    /*On Users*/
    ON_USERS: 'people',
    /*On Chat*/
    ON_PV_MSG: 'pvMessage',
    ON_MSG_SENT: 'msgSent',
    ON_MSG_RECEIVED: 'msgReceived',
    ON_MSG_READ: 'msgRead',
    ON_MSG_READ_RECEIVED: 'msgReadReceived',
    /*MSG*/
    /*Delivery*/
    DELIVERY_HIDDEN: 1,
    DELIVERY_WAITING: 2,
    DELIVERY_SENT: 3,
    DELIVERY_READ: 4,
    /*Transfer*/
    TRANSFER_SEND: 1,
    TRANSFER_RECEIVE: 2,
    /*Bubble*/
    BUBBLE_START: 1,
    BUBBLE_MIDDLE: 2,
    BUBBLE_END: 3,
    BUBBLE_SINGLE: 4,
    /*TYPE*/
    MSG_TYPE_TEXT: 0,
    MSG_TYPE_IMAGE: 2,
    MSG_TYPE_VOICE: 4,
    MSG_TYPE_VIDEO: 6,
    MSG_TYPE_MUSIC: 8,
    MSG_TYPE_FILE: 10,
    MSG_TYPE_DETAILS: 12,
    MSG_TYPE_PROFILE: 14,
    MSG_TYPE_LOTTIE: 16,
    /*User*/
    GENDER_MALE: 1,
    GENDER_FEMALE: 2,
    GENDER_MIXED: 3,

    TIME_ONLINE: 0,
    /*Rank*/
    RANK_GUEST: 0,
    RANK_MEMBER: 1,
    RANK_SPECIAL: 2,
    RANK_ACTIVE: 3,
    RANK_SENIOR: 4,
    RANK_ADMIN: 5,
    RANK_MANAGER: 6,
}

module.exports = {
    port,
    mongodpServerUrl,
    consts
}