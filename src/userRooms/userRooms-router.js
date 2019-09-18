const express = require('express');
const userRoomsServices = require('./userRooms-service');

const userRoomsRouter = express.Router();
const jsonParser = express.json();

const { addUserToRoom, getUserRoom, userLeavesRoom } = userRoomsServices

userRoomsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { user_id, rooms_id } = req.body
        const userRoomsInfo = { user_id, rooms_id }

        if (!user_id || !rooms_id) {
            next(new Error('No user id or room id specified'))
        }
        else {
            addUserToRoom(
                req.app.get('db'),
                userRoomsInfo
            )
            .then(row => {
                if (!row || row.length == 0) {
                    return res
                        .status(404)
                        .json()
                }
                else {
                    return res
                        .status(200)
                        .json(row)
                }
            })
        }
    })

userRoomsRouter
    .route('/:user_id/:rooms_id')
    .get((req, res, next) => {
        const { user_id, rooms_id } = req.params
        const userRoomsInfo = { user_id, rooms_id }

        // make sure both values exist
        if (!user_id || !rooms_id) {
            next(new Error('No user id or room id specified'))
        }
        else {
            getUserRoom(
                req.app.get('db'),
                userRoomsInfo
            )
            .then(row => {
                if (!row || row.length == 0) {
                    return res
                        .status(404)
                        .json()
                }
                else {
                    return res
                        .json(row[0])
                }
            })
        }
    })

userRoomsRouter
    .route('/userLeavesRoom')
    .delete(jsonParser, (req, res, next) => {
        const { user_id, rooms_id } = req.body
        const userRoomsInfo = { user_id, rooms_id }
        if (!user_id || !rooms_id) {
            next(new Error('No user id or room id specified'))
        }
        else {
            userLeavesRoom(
                req.app.get('db'),
                userRoomsInfo
            )
            .then(row => {
                if (row === 1) {
                    return res
                        .status(204)
                        .json(row)
                }
                else {
                    throw new Error('could not remove user from room')
                }
            })
            .catch(err => { return err })
        }
    })

module.exports = userRoomsRouter;