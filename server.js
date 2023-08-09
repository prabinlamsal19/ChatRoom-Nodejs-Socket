const path = require('path');
const http = require('http');
const express = require('express')
const formatMessage = require('./utils/messages')
const socketio = require('socket.io');

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
    console.log(`New Web Socket connection...`);
    socket.emit('message', formatMessage(botname, "Welcome To ChatCord!. (SOCKET EMIT)"));
    //this message is sent to the function. MSG1
    //accessed on js/main.js  
    //only provided to the user that is connecting 

    //broadcast when a user connects(to all except the user who is connecting)
    socket.broadcast.emit('message', formatMessage(botname, 'A user has joined the chat(SOCKET BROADCAST EMIT'));

    //runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage('USER', 'A user has left the chat (IO EMIT)'));
    });

    //listen for chatMessages 
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg)
    })
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
