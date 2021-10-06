
module.exports = {
    listen: function (app, peopleList) {

        app.get('/onlineUsers', (req, res) => {
            let ipv4 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (peopleList.exist(ipv4)) {
                res.send(peopleList.list());
            } else {
                res.status(403).send({ message: 'You are not logged in.' });
                console.log('loginGuest : You are not logged in.');
            }
        });
    }
};
