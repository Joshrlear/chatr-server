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
        console.log('line 15 userRooms-router', user_id, rooms_id)

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
                    console.log('-------------- no userRooms row added')
                    return res
                        .status(404)
                        .json()
                }
                else {
                    console.log('-------------- room:', row)
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
        console.log('line 44 userRooms-router', userRoomsInfo)

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
                console.log('this is the result from getUserRoom:', row[0])
                if (!row || row.length == 0) {
                    console.log('-------------- no userRooms row added')
                    return res
                        .status(404)
                        .json()
                }
                else {
                    console.log('-------------- room:', row[0])
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
        console.log('line 44 userRooms-router', user_id, rooms_id)
        if (!user_id || !rooms_id) {
            next(new Error('No user id or room id specified'))
        }
        else {
            userLeavesRoom(
                req.app.get('db'),
                userRoomsInfo
            )
            .then(row => {
                console.log('this is the result from userLeavesRoom:', row)
                if (row === 1) {
                    console.log('-------------- user was removed from room')
                    return res
                        .status(204)
                        .json(row)
                }
                else {
                    console.log('-------------- row:', row)
                    throw new Error('could not remove user from room')
                }
            })
            .catch(err => { return err })
        }
    })

module.exports = userRoomsRouter;