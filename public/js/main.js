//this js file is added to the chat.html page only.

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


//URL parsed into username and room field values
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const room = urlParams.get('room');

//join chatroom 
socket.emit('joinRoom', { username, room });

// GEt room and users 
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

//MSG1 is accessed and logged here on the client side
socket.on('message', message => {
    outputMessage(message);

    // scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

//submitting a message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //doesn't let submit to the file 
    const msg = e.target.elements.msg.value; //msg is the id of the inputfield
    socket.emit('chatMessage', msg);

    //clear the textinputfield
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM 
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
          <p class="text">
            ${message.text}
          </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM 

function outputRoomName(room) {
    roomName.innerText = room;

}

function outputUsers(users) {
    userList.innerHTML = ` 
        ${users.map(user => `${user.username}`).join('')}
    `
}