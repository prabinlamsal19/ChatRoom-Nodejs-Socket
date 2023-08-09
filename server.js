const path = require('path');
const http = require('http');
const express = require('express')
const formatMessage = require('./utils/messages')
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeavesChat, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//now we set this as the static folder.
//by default, on the home ,this shows the index.html file
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
const botname = "ChatCord"

//this is going to run when a client makes a socket request or smth like that
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //Welcome user 
        socket.emit('message', formatMessage(botname, "Welcome To ChatCord!. (SOCKET EMIT)"));
        //this message is sent to the function. MSG1
        //accessed on js/main.js  
        //only provided to the user that is connecting 

        //broadcast when a user connects(to all except the user who is connecting)
        socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} has joined the chat(SOCKET BROADCAST EMIT)`));
    });

    //listen for chatMessages 
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    //runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeavesChat(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} has left the chat (IO EMIT)`));
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 