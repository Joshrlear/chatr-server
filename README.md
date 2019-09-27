## Chatr

An easy to use chat app with clean animations and features
![landing page](src/images/landing-page.png)

### Live link
Try it out: https://chat-client.joshrlear.now.sh/

### `To get things started locally`

git clone into your project folder. Make sure to git clone the client files as well: https://github.com/Joshrlear/chatr-client<br>
Run: "npm i" to update all depedencies
For server run : "npm run dev"

### `Api Docs`

No external api. All api makes calls to postgres database.
the database can recieve the following req methods: GET, POST, DELETE

- user enters name > GET('/api/users')(check for user) > POST('/api/users') (create if doesn't exist)

- user enters new name while in chatroom > DELETE('/api/userrooms') (remove userRooms row that corresponds to user_id and rooms_id) > POST('/api/userrooms') (create new userRooms row - manyToMany relational table)

- user enters room > socket.io (add user to room) > POST('/api/userrooms') (create new userRooms row)

- user leaves room > socket.io (remove user from room) > DELETE('/api/userrooms') from userRooms

- user creates room > socket.io (user joins room) > GET('/api/rooms') (check rooms to see if room exists) > POST('/api/rooms') (if doesn't exist, room created in rooms table) > GET('/api/userrooms') (check userRooms table if userRooms connection exists) > POST('/api/userrooms') (if userRooms doesn't exist, create userRooms connection)

- user types > socket.io (broadcast.emit userTyping message to all but user)

- user stops typing > socket.io (wait 3 seconds, then end broadcast.emit userTyping messasge)

- user sends message > socket.io (if exists, end userTyping message) > socket.io (broadcast.emit message: { user_id, username, rooms_id, roomName, timeStamp })


### `Built with:`

- Nodejs
- postgresql
- knex
- underscore
- socket.io
- heroku
- testing: mocha, chai

### `Features`

Chatr currently features real time messaging wtih the ability to 
change profile information from any screen accept the landing page.
Profile is accessible from most pages.

**Chatr does not require login and does not save messages. who you are**
**and what you say is your business.**

### `Future updates`

- ability to add images to profile.
- ability to send images in chat.
- the ability to create private "sidechats" inside of a group message without leavine room or current page.
To start a sidechat the sender starts a message by typing the recievers name
- switch between group chat and sidechat easily by clicking/tapping that chats icon.
- chat icons showing thumbnail of all user images to signify who is in which room
- easily see all users in chatroom with users profile thumbnail displayed at the top
of the chat.

## version

Live: v 1.0