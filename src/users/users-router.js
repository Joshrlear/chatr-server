const express = require('express');
const userServices = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const { createUser, getUser } = userServices

/* const serializeUser = user => ({
    id: user.id,
    name: user.username
}) */

usersRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        console.log('================== this is the req:', req.body)
        const { username } = req.body
        console.log('* * * * * Line 15 users-router username should be right here:', username)
        if(!username) {
            next(new Error('No username provided'))
        }
        else {
            createUser(
                req.app.get('db'),
                username
            )
            // added res rather than (), may need remove if not returning properly
            .then(user => {
                console.log('((((((((( from users-router, this is the createUser res:', res)
                return res.json(user)
            })
        }
    })

usersRouter
    .route('/:username')
    .get((req, res, next) => {
        const username = req.params.username
        console.log('line 39 users-router', username)

        if (!username) {
            next(new Error('No username provided'))
        }
        else {
            getUser(
                req.app.get('db'),
                username
            )
            .then(user => {
                if (!user || user.length == 0) {
                    console.log('-------------- no user')
                    return res
                        .status(404)
                        .json()
                }
                else {
                    console.log('-------------- user:', user[0])
                    return res
                        .status(200)
                        .json(user[0])
                }
            })
        }
    })

module.exports = usersRouter;