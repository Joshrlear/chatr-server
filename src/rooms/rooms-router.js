const express = require('express');
const roomServices = require('./rooms-service');
const _ = require('underscore')

const roomsRouter = express.Router();
const jsonParser = express.json();

// create room or get all rooms
roomsRouter
    .route('/')
    .all(jsonParser, (req, res, next) => {
        const knex = req.app.get('db')
        console.log('================== this is the req:', req.body)
        const { roomName } = req.body
        req.body && console.log('* * * * * Line 15 rooms-router roomName should be right here:', roomName)
        if(_.isEmpty(roomName)) {
            // get all rooms
            console.log('no roomName so we will return all rooms')
            roomServices.getAllRooms(
                knex
            )
            .then(data => {
                console.log('this is the date from the getAllRooms request:',data)
                return res
                    .status(200)
                    .json(data)
            })
        }
        else {
            roomServices.createRoom(
                knex,
                roomName
            )
            .then(data => {
                console.log('^^^^^^^^^^^ In rooms-router, display the createRoom res:', data)
                return res.json(data)
            })
        }
    })

roomsRouter
    .route('/:roomQuery')
    .get((req, res, next) => {
        console.log('--------------', req.params)
        let roomQuery

        // number or NAN
        req.params.roomQuery.split("=")[1] == 'id'
            ?   (roomQuery = {
                    [req.params.roomQuery.split("=")[1]]: parseInt(req.params.roomQuery.split("=")[0])
                })
            :   (roomQuery = {
                    [req.params.roomQuery.split("=")[1]]: req.params.roomQuery.split("=")[0]
                })

        console.log('line 14 rooms-router', roomQuery)

        if (!roomQuery) {
            next(new Error('No roomQuery provided'))
        }
        else {
            console.log(Object.keys(roomQuery) == 'id')
            console.log(roomQuery)
            Object.keys(roomQuery) == 'id' 
                &&  roomServices.getRoomById(
                    req.app.get('db'),
                    roomQuery
                )
                .then(room => {
                    if (!room || room.length == 0) {
                        console.log('-------------- no room')
                        return res
                            .status(404)
                            .json()
                    }
                    else {
                        console.log('-------------- room:', room[0])
                        return res
                            .status(200)
                            .json(room[0])
                    }
                })
            console.log('////////////logging')
            Object.keys(roomQuery) == 'name'
                &&  roomServices.getRoomByName(
                    req.app.get('db'),
                    roomQuery
                )
                .then(room => {
                    if (!room || room.length == 0) {
                        console.log('-------------- no room')
                        return res
                            .status(404)
                            .json()
                    }
                    else {
                        console.log('-------------- room:', room[0])
                        return res
                            .status(200)
                            .json(room[0])
                    }
                })
        }
    })

module.exports = roomsRouter;