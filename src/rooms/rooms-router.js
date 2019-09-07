const express = require('express');
const roomServices = require('./rooms-service');

const roomsRouter = express.Router();
const jsonParser = express.json();

const serializeRoom = room => ({
    id: room.id,
    name: room.name
})

roomsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        console.log('================== this is the req:', req.body)
        const { roomName } = req.body
        console.log('* * * * * Line 15 rooms-router roomName should be right here:', roomName)
        if(!roomName) {
            next(new Error('No roomName provided'))
        }
        else {
            roomServices.createRoom(
                req.app.get('db'),
                roomName
            )
            .then(data => {
                console.log('^^^^^^^^^^^ In rooms-router, display the createRoom res:', data)
                return res.json(data)
            })
        }
    })

roomsRouter
    .route('/:roomName')
    .get((req, res, next) => {
        const roomName = req.params.roomName
        console.log('line 14 rooms-router', roomName)

        if (!roomName) {
            next(new Error('No roomName provided'))
        }
        else {
            roomServices.getRoom(
                req.app.get('db'),
                roomName
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