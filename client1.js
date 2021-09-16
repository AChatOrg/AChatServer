const axios = require('axios').default;
const url = 'http://localhost:24240';

axios.post(url + '/register', {
    username: 'aliUser',
    password: 'aliPass',
    avatar: 'avatarUrl',
    bio: 'aliBio',
    gender: 1
}).then(res => {
    console.log(res.data);
}).catch(err => {
    console.error(err.response.status + ': ' + err.response.data.message);
});