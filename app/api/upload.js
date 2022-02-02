const fileUpload = require('express-fileupload');
const fs = require('fs');
const sharp = require('sharp');
const UserDao = require('../da/UserDao');
const bcrypt = require('bcrypt');
const rootDir = require('../config').rootDir

module.exports = {

    listen: function (app) {

        app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles: true,
            tempFileDir: rootDir + '/files/tmp/'
        }));

        app.post('/avatar', async function (req, res) {
            if (!req.files || !req.body)
                return res.status(400).send('File does not exist');

            let file = req.files.avatar;
            let uid = req.body.uid;

            if (!file || !uid) {
                return res.status(400).send('File does not exist');
            } else {
                upload(res, file, uid);
            }

        });

        async function upload(res, file, uid) {
            let dir = rootDir + '\\files\\Users\\' + uid + '\\avatars\\';

            if (!fs.existsSync(dir + 'thumbnail\\'))
                fs.mkdirSync(dir + 'thumbnail\\', { recursive: true });

            await file.mv(dir + file.name, async function (err) {
                if (err)
                    return res.status(500).send(err);
                await sharp(dir + file.name).resize(162, 162).toFile(dir + 'thumbnail\\' + file.name, (err) => {
                    if (err)
                        return res.status(500).send('upload error' + err);
                    res.send('/avatar/' + uid + '/' + file.name);
                });
            });
        }

        app.get('/avatar/:uid/:fileName', (req, res) => {
            let pic = rootDir + '\\files\\Users\\' + req.params.uid + '\\avatars\\' + req.params.fileName;
            res.download(pic);
        });

        app.get('/avatarThumbnail/:uid/:fileName', (req, res) => {
            let pic = rootDir + '\\files\\Users\\' + req.params.uid + '\\avatars\\thumbnail\\' + req.params.fileName;
            res.download(pic);
        });
    }
};