const app = require('./app')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const knex = require('knex')

const { PORT, DB_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

const nsp = io.of('/chat')
nsp.on('connection', socket => {
  socket.emit('welcome', "connected to chat")
})

// listens for connection to socket.io
io.on('connection', socket => {

  // room for info share between same client components
  socket.on('connect to components', connection_id => {
    console.log('joining:', connection_id)
    const componentConnection = socket.join(connection_id)
  })

  socket.on('changePointerEvents', value => {
    socket.to(value.connection_id).emit('changePointerEvents', value.event)
  })

  socket.on('joinRoom', info => {
    const room = socket.join(info.roomName)

    room.emit('welcome message', {
      message: `You have successfully joined ${info.roomName}!` 
    })
    /* room.broadcast.emit('user joined room', { 
      message: `${info.username} has joined.` 
    }) */
    socket.to(info.roomName).emit('user joined room', { 
      message: `${info.username} has joined.` 
    })
    console.log(`${info.username} has joined:`, info.roomName)
  })

  // listens for 'newMessage' socket then
  // logs newMsg
  socket.on('newMessage', messageToRoom => {
    const { username, message, timestamp } = messageToRoom
    const incomingMsg = { username, message, timestamp }
    // then sends newMsg to everyone except sender
    socket.to(messageToRoom.roomName).emit('incoming message', incomingMsg)

    // then sends newMsg to everyone except sender
    //socket.broadcast.emit('incoming message', newMsg)
  })

  socket.on('typing', info => {
    socket.to(info.roomName).broadcast.emit('typing', info.user)
  })

  socket.on('stop typing', info => {
    socket.to(info.roomName).broadcast.emit('stop typing', info.user)
  })

  socket.on('userLeavesRoom', userLeavingInfo => {
    socket.to(userLeavingInfo.connection_id).emit('userLeavesRoom', userLeavingInfo)
  })

  // listens for 'disconnected' socket then
  // logs {username} disconnected
  socket.on('disconnected', userLeaving => {
    const room = socket.leave(userLeaving.roomName)
    room.emit('user left message', {
      message: `${userLeaving.username} has left ${userLeaving.roomName}` 
    })
    console.log(userLeaving.username, 'has successfully disconnected!')
  })
})