const readline = require('readline');
const log = console.log;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//---------------------------------------
const axios = require('axios').default;
const url = 'http://localhost:24240';
//---------------------------------------
const recursiveAsyncReadLine = function () {
    rl.question('', function (answer) {
        if (answer == 'ex')
            return rl.close();
        log('----------------------');
        switch (answer) {
            case 'lgg'://loginGuest
                axios.get(url + '/loginGuest/?name=hosein&bio=hoseinBio&gender=1')
                    .then(res => {
                        console.log(res.data);
                    }).catch(err => {
                        console.error(err.response.status + ': ' + err.response.data.message);
                    });
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
        }
        recursiveAsyncReadLine();
    });
};
recursiveAsyncReadLine();