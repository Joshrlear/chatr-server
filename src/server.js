const app = require('./app')
var server = require('http').Server(app)
var io = require('socket.io')(server)

const { PORT } = require('./config')

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

const nsp = io.of('/chat')
nsp.on('connection', socket => {
  console.log(`user connected!`)
  socket.emit('welcome', "connected to chat")
  socket.on('joinRoom', roomName => {
    socket.join(roomName)
    console.log()
  })
})

// listens for connection to socket.io
io.on('connection', socket => {

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
  socket.on('newMessage', newMsg => {
    console.log(newMsg)

    // then sends newMsg to everyone except sender
    socket.broadcast.emit('incoming message', newMsg)
  })

  // listens for 'disconnected' socket then
  // logs {username} disconnected
  socket.on('disconnected', user => {
    console.log(user, 'has successfully disconnected!')
  })
})