const socket = io();
const registerButton = document.getElementById('register');
const usernameInput = document.getElementById('username');
const chat = document.getElementById('chat');
const userSelect = document.getElementById('userSelect');
const form = document.getElementById('chat-form');
const input = document.getElementById('messageInput');
const messagesList = document.getElementById('messages');

registerButton.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) {
        socket.emit('register', username);
        chat.style.display = 'block';
        usernameInput.value = '';
    }
});

socket.on('registered', (username) => {
    const option = document.createElement('option');
    option.value = username;
    option.textContent = username;
    userSelect.appendChild(option);
});

socket.on('user connected', (username) => {
    const option = document.createElement('option');
    option.value = username;
    option.textContent = username;
    userSelect.appendChild(option);
});

socket.on('user disconnected', (username) => {
    const options = userSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === username) {
            userSelect.remove(i);
            break;
        }
    }
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const recipient = userSelect.value;
    const message = input.value;
    if (message) {
        socket.emit('private message', { recipient, message });
        input.value = '';
    }
});

socket.on('private message', ({ from, message }) => {
    const li = document.createElement('li');
    li.textContent = `${from}: ${message}`;
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight; // Scrolla in basso
});
