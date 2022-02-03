const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('./config');
const mongoose = require('./da/mongoose');
const loginApi = require('./api/loginApi');
const UserDao = require('./da/UserDao');
const consts = require('./config').consts

const app = express()
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(config.mongodpServerUrl);
server.listen(config.port);

app.get('/', (req, res) => {
    res.send('<h1>Welcome to USA.</h1>')
});

app.post('/' + consts.HTTP_REFRESH_TOKEN, (req, res) => {
    const username = req.headers["username"];
    const authHeader = req.headers["authorization"]
    const refreshToken = authHeader && authHeader.split(' ')[1]

    if (!refreshToken) {
        return res.status(401).send("Unauthorized")
    }

    UserDao.findByUsername(username).then(userFound => {
        if (userFound) {
            jwt.verify(refreshToken, userFound.tokenKey, { algorithms: ['HS256'] }, (err, payload) => {
                if (err) {
                    return res.status(401).send("Unauthorized")

                } else if (payload) {
                    let usrnm = payload.username;
                    if (usrnm && usrnm == username) {
                        jwt.verify(userFound.token, userFound.tokenKey, { algorithms: ['HS256'] }, (err, payload) => {
                            if (err) {//only if token has expired generate new token
                                userFound.tokenKey = crypto.randomBytes(256).toString('base64')
                                jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '1d' }, (err, token) => {
                                    if (err) {
                                        return res.status(500).send("Internal server error")
                                    } else {
                                        userFound.token = token;
                                        jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '30d' }, (err, refreshToken) => {
                                            if (err) {
                                                return res.status(500).send("Internal server error")
                                            } else {
                                                userFound.save()
                                                let result = {
                                                    token: token,
                                                    refreshToken: refreshToken
                                                }
                                                return res.send(JSON.stringify(result))
                                            }
                                        })
                                    }
                                })
                            } else {//if user has a valid token force logout (someone has accessed to refresh token)
                                userFound.token = "attacks detected";
                                userFound.tokenKey = "try to connect with refreshToken, but access token has not expired";
                                userFound.save();
                                return res.status(401).send("Unauthorized")
                            }
                        });
                    } else {
                        return res.status(500).send("Internal server error")
                    }
                } else {
                    return res.status(500).send("Internal server error")
                }
            })
        } else {
            return res.status(404).send("User not found")
        }
    }).catch(err => {
        return res.status(500).send("Internal server error")
    })
})

app.post('*', (req, res, next) => {
    const username = req.headers["username"];
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if (!token || !username) {
        return res.status(401).send("Unauthorized")
    }

    UserDao.findByUsername(username).then(userFound => {
        if (userFound) {
            jwt.verify(token, userFound.tokenKey, { algorithms: ['HS256'] }, (err, payload) => {
                if (err) {
                    if (err.expiredAt < new Date().getTime()) {
                        return res.status(400).send("Token expired")
                    } else {
                        return res.status(401).send("Unauthorized")
                    }
                } else if (payload) {
                    let usrnm = payload.username;
                    if (usrnm && usrnm == username) {
                        userFound.tokenKey = crypto.randomBytes(256).toString('base64')
                        jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '1d' }, (err, token) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send("cannot sign token")
                            } else {
                                userFound.token = token;
                                jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '30d' }, (err, refreshToken) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).send("cannot sign refresh token")
                                    } else {
                                        userFound.save()
                                        res.locals.dbUser = userFound;
                                        res.locals.token = token;
                                        res.locals.refreshToken = refreshToken;
                                        next()
                                    }
                                })
                            }
                        })
                    } else {
                        return res.status(500).send("cannot decode username")
                    }
                } else {
                    return res.status(500).send("payload is null or undefined")
                }
            })
        } else {
            return res.status(404).send("User not found 2")
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).send("User not found 1")
    })
});


loginApi.listen(app, server);
