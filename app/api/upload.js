const fileUpload = require('express-fileupload');
const fs = require('fs');
const sharp = require('sharp');

const rootDir = require('../config').rootDir;
const { consts } = require('../config');
const User = require('../model/User').User

module.exports = {

    listen: function (app, io, userManager) {

        app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles: true,
            tempFileDir: rootDir + '/files/tmp/'
        }));

        app.post('/avatar', async function (req, res) {
            const dbUser = res.locals.dbUser;
            const token = res.locals.token;
            const refreshToken = res.locals.refreshToken;
            const username = dbUser.username;
            
            if (!dbUser || !token || !refreshToken)
                return res.status(500).send('locals are null or undefined');

            if (!req.files)
                return res.status(404).send('File does not exist 1');

            let file = req.files.avatar;

            if (!file || !username) {
                return res.status(404).send('File does not exist 2');
            } else if (dbUser.avatars.length >= 10) {
                return res.status(402).send('avatars is full 10')
            } else {
                uploadAvatar(res, file, username, dbUser, token, refreshToken);
            }

        });

        async function uploadAvatar(res, file, username, dbUser, token, refreshToken) {
            let dir = rootDir + '\\files\\Users\\' + username + '\\avatars\\';

            if (!fs.existsSync(dir + 'thumbnail\\'))
                fs.mkdirSync(dir + 'thumbnail\\', { recursive: true });

            await file.mv(dir + file.name, async function (err) {
                if (err)
                    return res.status(500).send(err);
                await sharp(dir + file.name).resize(162, 162).toFile(dir + 'thumbnail\\' + file.name, (err) => {
                    if (err)
                        return res.status(500).send('upload error' + err);

                    let result = {
                        token: token,
                        refreshToken: refreshToken,
                        avatar: '/avatar/' + username + '/' + file.name
                    }

                    dbUser.avatars.unshift(result.avatar)
                    dbUser.save()

                    let user = new User(dbUser.name, dbUser.bio, dbUser.gender, dbUser.avatars, dbUser.uid, dbUser.rank, dbUser.score, dbUser.loginTime, dbUser.username)
                    io.emit(consts.ON_USER_EDIT, user)
                    userManager.update(user)
                    
                    res.send(JSON.stringify(result));
                });
            });
        }

        app.get('/avatar/:username/:fileName', (req, res) => {
            let pic = rootDir + '\\files\\Users\\' + req.params.username + '\\avatars\\' + req.params.fileName;
            res.download(pic);
        });

        app.get('/avatar/:username/:fileName/thumb', (req, res) => {
            let pic = rootDir + '\\files\\Users\\' + req.params.username + '\\avatars\\thumbnail\\' + req.params.fileName;
            res.download(pic);
        });
    }
};