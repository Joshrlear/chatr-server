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
  console.log(`user connected!`)
  socket.emit('welcome', "connected to chat")
})

// listens for connection to socket.io
io.on('connection', socket => {
  console.log('user connected')

  // room for info share between same client components
  socket.on('connect to components', connection_id => {
    console.log('joining:', connection_id)
    const componentConnection = socket.join(connection_id)
  })

  socket.on('changePointerEvents', value => {
    console.log('changing click events!', value)
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

  // on connection, server emits 'news' socket 
  // with object hello: world
  socket.emit('news', { hello: 'world' })

  // server listens for 'my other event' socket 
  // and then logs the data that was sent
  socket.on('my other event', data => {
    console.log(data);
  })

  // listens for 'newMessage' socket then
  // logs newMsg
  socket.on('newMessage', messageToRoom => {
    console.log('here--------------')
    const { username, message, timestamp } = messageToRoom
    const incomingMsg = { username, message, timestamp }
    console.log('stuff:',messageToRoom)
    // then sends newMsg to everyone except sender
    socket.to(messageToRoom.roomName).emit('incoming message', incomingMsg)

    // then sends newMsg to everyone except sender
    //socket.broadcast.emit('incoming message', newMsg)
  })

  socket.on('typing', info => {
    console.log(info)
    socket.to(info.roomName).broadcast.emit('typing', info.user)
  })

  socket.on('stop typing', info => {
    socket.to(info.roomName).broadcast.emit('stop typing', info.user)
  })

  // listens for 'disconnected' socket then
  // logs {username} disconnected
  socket.on('disconnected', user => {
    console.log(user, 'has successfully disconnected!')
  })
})