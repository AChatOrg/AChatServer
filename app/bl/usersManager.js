const UserDao = require('../da/UserDao');
const UserList = require('../model/UserList');
const User = require('../model/User').User;
const consts = require('../config').consts

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userList = new UserList();

const profileUsers = []
//////////////////////////
for (let i = 0; i < 10; i++) {
    let user = new User("name " + i, "bio " + i, Math.random() < 0.5 ? 1 : 2, ['https://i.pravatar.cc/150?img=' + Math.random()], i, Math.floor(Math.random() * (6 - 0 + 1) + 0), i, i);
    profileUsers.push({ uid: user.key.uid, name: user.name, rank: user.key.rank, avatars: user.avatars })
    userList.add(user);
}
//////////////////////////

module.exports = {

    userList,

    addUserIfNotExist: function (user) {
        if (userList.exist(user.key.uid)) {
            return false;
        }
        userList.add(user);
        return true;
    },

    update: function (user) {
        userList.update(user.key.uid, user)
    },

    getUserInfo: function (uid, requesterUid) {
        return new Promise((resolve, reject) => {
            UserDao.find(uid).then(user => {
                let likedByMe = false;
                if (user.likerUids.includes(requesterUid)) {
                    likedByMe = true;
                }
                let userInfo = {
                    viewsCount: user.viewsCount,
                    likesCount: user.likesCount,
                    friendsCount: user.friendsCount,
                    friendList: profileUsers,
                    viewerList: profileUsers,
                    likedByMe: likedByMe
                }
                resolve(userInfo)
            })
                .catch(err => reject(err))
        })
    },

    register: function (user, username, password) {
        return new Promise((resolve, reject) => {
            if (/^[a-zA-Z_][\w](?!.*?\.{2})[\w.]{1,28}[\w]$/.test(username) && password.length >= 4) {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (!err && hash) {
                        user.username = username
                        user.passwordHash = hash
                        user.rank = consts.RANK_MEMBER
                        user.tokenKey = crypto.randomBytes(256).toString('base64')
                        jwt.sign({ username: username }, user.tokenKey, { algorithm: 'HS256', expiresIn: '1d' }, (err, token) => {
                            if (err) {
                                reject(err)
                            } else {
                                user.token = token;
                                jwt.sign({ username: username }, user.tokenKey, { algorithm: 'HS256', expiresIn: '30d' }, (err, refreshToken) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        UserDao.update(user).then(userUpdated => {
                                            if (userUpdated) {
                                                let resultUser = new User(userUpdated.name, userUpdated.bio, userUpdated.gender,
                                                    userUpdated.avatars, userUpdated.uid, userUpdated.rank, userUpdated.score,
                                                    userUpdated.loginTime, userUpdated.username)
                                                userList.remove(resultUser.key.uid);
                                                userList.add(resultUser);
                                                resolve({ user: resultUser, token: token, refreshToken: refreshToken })
                                            } else {
                                                reject("userUpdated is null")
                                            }
                                        }).catch(err => {
                                            reject(err)
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                reject("invalid username or password")
            }
        });
    },

    loginByPass: function (username, password) {
        return new Promise((resolve, reject) => {
            UserDao.findByUsername(username).then(userLogged => {
                if (userLogged) {
                    bcrypt.compare(password, userLogged.passwordHash).then(res => {
                        if (res) {
                            userLogged.tokenKey = crypto.randomBytes(256).toString('base64')
                            jwt.sign({ username: username }, userLogged.tokenKey, { algorithm: 'HS256', expiresIn: '1d' }, (err, token) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    userLogged.token = token;
                                    jwt.sign({ username: username }, userLogged.tokenKey, { algorithm: 'HS256', expiresIn: '30d' }, (err, refreshToken) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            console.log(refreshToken);
                                            userLogged.save()
                                            resolve({ dbUser: userLogged, token: token, refreshToken: refreshToken })
                                        }
                                    })
                                }
                            })
                        } else {
                            reject('incorrectPassword')
                        }
                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    reject('userNotFound')
                }
            }).catch(err => {
                reject(err)
            })
        })
    },

    reconnectUser: function (username, token) {
        return new Promise((resolve, reject) => {
            UserDao.findByUsername(username).then(userFound => {
                if (userFound) {
                    jwt.verify(token, userFound.tokenKey, { algorithms: ['HS256'] }, (err, payload) => {
                        if (err) {
                            if (err.expiredAt < new Date().getTime()) {
                                reject(consts.CONNECTION_ERR_TOKEN_EXPIRED)
                            } else {
                                reject(consts.CONNECTION_ERR_REFRESH_TOKEN_EXPIRED)
                            }
                        } else if (payload) {
                            let usrnm = payload.username;
                            if (usrnm && usrnm == username) {
                                userFound.tokenKey = crypto.randomBytes(256).toString('base64')
                                jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '1d' }, (err, token) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        userFound.token = token;
                                        jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '30d' }, (err, refreshToken) => {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                userFound.save()
                                                resolve({ dbUser: userFound, token: token, refreshToken: refreshToken })
                                            }
                                        })
                                    }
                                })
                            } else {
                                reject('usrnm is null or != username')
                            }
                        } else {
                            reject('payload is null')
                        }
                    })
                } else {
                    reject('user not found')
                }
            }).catch(err => {
                reject(err)
            })
        })
    },

    reconnectUserByRefreshToken: function (username, refreshToken) {
        return new Promise((resolve, reject) => {
            UserDao.findByUsername(username).then(userFound => {
                if (userFound) {
                    jwt.verify(refreshToken, userFound.tokenKey, { algorithms: ['HS256'] }, (err, payload) => {
                        if (err) {
                            reject(consts.CONNECTION_ERR_REFRESH_TOKEN_EXPIRED)

                        } else if (payload) {
                            let usrnm = payload.username;
                            if (usrnm && usrnm == username) {
                                jwt.verify(userFound.token, userFound.tokenKey, { algorithms: ['HS256'] }, (err, payload) => {
                                    if (err) {//only if token has expired generate new token
                                        userFound.tokenKey = crypto.randomBytes(256).toString('base64')
                                        jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '1d' }, (err, token) => {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                userFound.token = token;
                                                jwt.sign({ username: username }, userFound.tokenKey, { algorithm: 'HS256', expiresIn: '30d' }, (err, refreshToken) => {
                                                    if (err) {
                                                        reject(err)
                                                    } else {
                                                        userFound.save()
                                                        resolve({ dbUser: userFound, token: token, refreshToken: refreshToken })
                                                    }
                                                })
                                            }
                                        })
                                    } else {//if user has a valid token force logout (someone has accessed to refresh token)
                                        userFound.token = "attacks detected";
                                        userFound.tokenKey = "try to connect with refreshToken, but access token has not expired";
                                        userFound.save();
                                        reject(consts.CONNECTION_ERR_REFRESH_TOKEN_EXPIRED)
                                    }
                                });
                            } else {
                                reject('usrnm is null or != username')
                            }
                        } else {
                            reject('payload is null')
                        }
                    })
                } else {
                    reject('user not found')
                }
            }).catch(err => {
                reject(err)
            })
        })
    },

    changePass: function (uid, currPass, newPass) {
        return new Promise((resolve, reject) => {
            UserDao.find(uid).then(user => {
                bcrypt.compare(currPass, user.passwordHash).then(res => {
                    if (res) {
                        bcrypt.hash(newPass, 10, (err, hash) => {
                            if (!err && hash) {
                                user.passwordHash = hash;
                                user.save()
                                resolve(consts.CHNG_PASS_MSG_SUCCESS)
                            } else {
                                reject(err || 'error')
                            }
                        })
                    } else {
                        reject(consts.CHNG_PASS_MSG_WRONG_PASS)
                    }
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
}