const express = require('express');
const userServices = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const { createUser, getUser } = userServices

usersRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { username } = req.body
        if(!username) {
            next(new Error('No username provided'))
        }
        else {
            createUser(
                req.app.get('db'),
                username
            )
            .then(user => {
                return res.json(user)
            })
        }
    })

usersRouter
    .route('/:username')
    .get((req, res, next) => {
        const username = req.params.username

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
                    return res
                        .status(404)
                        .json()
                }
                else {
                    return res
                        .status(200)
                        .json(user[0])
                }
            })
        }
    })

module.exports = usersRouter;