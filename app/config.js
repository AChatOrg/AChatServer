const port = 24240;
const mongodpServerUrl = 'mongodb://localhost/AChat';
const operations = {
    loginGuest: 'loginGuest',
    login: 'login',
    /*On login*/
    ON_LOGGED: 'logged',
    ON_USER_CAME: 'userCame',
    ON_USER_LEFT: 'userLeft',
    /*On Users*/
    ON_USERS: 'people',
    /*On Chat*/
    ON_PV_MESSAGE: 'pvMessage',
    ON_MESSAGE_SENT: 'msgSent'
}

module.exports = {
    port,
    mongodpServerUrl,
    operations
}