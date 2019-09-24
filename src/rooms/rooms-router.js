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
        const { roomName } = req.body
        if(_.isEmpty(roomName)) {
            // get all rooms
            roomServices.getAllRooms(
                knex
            )
            .then(data => {
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
                return res.json(data)
            })
        }
    })

roomsRouter
    .route('/:roomQuery')
    .get((req, res, next) => {
        let roomQuery

        // number or NAN
        req.params.roomQuery.split("=")[1] == 'id'
            ?   (roomQuery = {
                    [req.params.roomQuery.split("=")[1]]: parseInt(req.params.roomQuery.split("=")[0])
                })
            :   (roomQuery = {
                    [req.params.roomQuery.split("=")[1]]: req.params.roomQuery.split("=")[0]
                })

        if (!roomQuery) {
            next(new Error('No roomQuery provided'))
        }
        else {
            Object.keys(roomQuery) == 'id' 
                &&  roomServices.getRoomById(
                    req.app.get('db'),
                    roomQuery
                )
                .then(room => {
                    if (!room || room.length == 0) {
                        return res
                            .status(204)
                            .json()
                    }
                    else {
                        return res
                            .status(200)
                            .json(room[0])
                    }
                })
            Object.keys(roomQuery) == 'name'
                &&  roomServices.getRoomByName(
                    req.app.get('db'),
                    roomQuery
                )
                .then(room => {
                    if (!room || room.length == 0) {
                        return res
                            .status(204)
                            .json()
                    }
                    else {
                        return res
                            .status(200)
                            .json(room[0])
                    }
                })
        }
    })

module.exports = roomsRouter;