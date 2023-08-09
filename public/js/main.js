const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

//MSG1 is accessed and logged here on the client side
socket.on('message', message => {
    console.log(message);
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
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
          <p class="text">
            ${message}
          </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}