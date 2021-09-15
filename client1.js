const axios = require('axios').default;
const url = 'http://localhost:24240';

axios.post(url + '/register', {
    username: 'aliUser',
    password: 'aliPass',
    name: 'ali',
    bio: 'aliBio',
    gender: 1
}).then(res => {
    console.log(res.body);
}).catch(err => {
    console.error(err.message);
});