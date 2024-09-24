const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
    console.log('Un utente si è connesso');

    socket.on('register', (username) => {
        users[socket.id] = username; // Associa l'ID socket all'username
        socket.emit('registered', username);
        socket.broadcast.emit('user connected', username); // Notifica agli altri utenti
        console.log(`${username} si è registrato`);
    });

    socket.on('private message', ({ recipient, message }) => {
        const recipientSocket = Object.keys(users).find(key => users[key] === recipient);
        if (recipientSocket) {
            io.to(recipientSocket).emit('private message', {
                from: users[socket.id],
                message
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} si è disconnesso`);
        socket.broadcast.emit('user disconnected', users[socket.id]); // Notifica agli altri utenti
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server in esecuzione su http://localhost:3000');
});
