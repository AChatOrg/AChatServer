const readline = require('readline');
const io = require('socket.io-client');
const log = console.log;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//---------------------------------------
let Data = {
    operation: 'reconnectUserByRefreshToken',
    username:'hyapp',
    name: 'hosein',
    bio: 'archer',
    gender: 1
};
//---------------------------------------
const socket = io('http://localhost:24240/',{auth:{token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh5YXBwIiwiaWF0IjoxNjQzNzM0MTU0LCJleHAiOjE2NDYzMjYxNTR9.NU3bk6n-GivqMb3NLPO80kpnIO1uomY_Mx38nO9aMZw'}, query: { data: JSON.stringify(Data) } });
//--------------------------------------
const recursiveAsyncReadLine = function () {
    rl.question('', function (answer) {
        if (answer == 'ex')
            return rl.close();
        log('----------------------');
        switch (answer) {
            case 'lg'://loginGuest
                socket.connect();
                break;

            case 'lo'://logout
                socket.disconnect();
                break;

            case 'rg'://register

                break;

            case 'pp'://onlineUsers
                socket.emit('user');
                break;
            case 'pv'://PV Message
                socket.emit('pvMessage',JSON.stringify({
                    type: 'com.hyapp.achat.model.TextMessage',
                    data: {
                      ExtraTextSize: 0,
                      text: 'فاطمه ',
                      delivery: 2,
                      receiverUid: '::ffff:192.168.1.102',
                      sender: {
                        id: 0,
                        loginTime: 1641243758235,
                        messageDelivery: 1,
                        messageTime: 0,
                        onlineTime: 0,
                        rank: 6,
                        score: 0,
                        type: 1,
                        uid: 'aaa',
                        avatars: [],
                        rankColor: -6381922,
                        rankStrRes: 2131755064,
                        bio: 'خواروبار فروش',
                        gender: 1,
                        name: 'hosein'
                      },
                      uid: 'e60fce46-88f4-4641-9325-c754d172585c',
                      timeMillis: 1641243763343,
                      transferType: 1,
                      type: 0
                    }
                  }))
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
    log('client/ userCame: ' + user.name + ' ' + user.key.uid);
});

socket.on('userLeft', userId => {
    log('client/ userLeft: ' + userId);
});
socket.on('user', user => {
    for (let p of user) {
        log(p.name);
    }
});
//----------------------------------------------------
socket.on('pvMessage', message => {
    log(message)
});