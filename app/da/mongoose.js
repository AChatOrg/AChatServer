const mongoose = require('mongoose');

module.exports = {
    connect: async function (mongodbServerUrl) {

        await mongoose.connect(mongodbServerUrl)
        .catch(error => console.error(error));

        mongoose.connection.on('error', error => {
            console.error(error);
        });
    }
}