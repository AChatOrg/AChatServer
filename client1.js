const readline = require('readline');
const io = require('socket.io-client');
const log = console.log;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//---------------------------------------
let Data = {
    operation: 'loginGuest',
    name: 'hosein',
    bio: 'archer',
    gender: 1
};
//---------------------------------------
const socket = io('http://localhost:24240/', { query: { data: JSON.stringify(Data) } });
//--------------------------------------
const recursiveAsyncReadLine = function () {
    rl.question('', function (answer) {
        if (answer == 'ex')
            return rl.close();
        log('----------------------');
        switch (answer) {
            case 'lg'://loginGuest
                // axios.get(url + '/loginGuest/?name=hosein&bio=hoseinBio&gender=1')
                //     .then(res => {
                //         console.log(res.data);
                //     }).catch(err => {
                //         console.error(err.response.status + ': ' + err.response.data.message);
                //     });
                socket.connect();
                break;

            case 'lo':
                socket.disconnect();
                break;

            case 'rg'://register
                axios.post(url + '/register', {
                    username: 'aliUser',
                    password: 'aliPass',
                    name: 'ali',
                    avatar: 'avatarUrl',
                    bio: 'aliBio',
                    gender: 1
                }).then(res => {
                    console.log(res.data);
                }).catch(err => {
                    console.error(err.response.status + ': ' + err.response.data.message);
                });
                break;

            case 'ou'://onlineUsers
                axios.get(url + '/onlineUsers')
                    .then(res => {
                        console.log(res.data);
                    }).catch(err => {
                        console.error(err.response.status + ': ' + err.response.data.message);
                    });
                break;
        }
        recursiveAsyncReadLine();
    });
};
recursiveAsyncReadLine();
//--------------------------------------------------
socket.on('connect', () => {
    log('client/ connected');
});

socket.on('disconnect', () => {
    log('client/ disconnected');
});
//----------------------------------------------------
socket.on('logged', user => {
    log(user)
});

socket.on('userCame', user => {
    log('client/ userCame: ' + user.name);
});

socket.on('userLeft', ipv4 => {

});