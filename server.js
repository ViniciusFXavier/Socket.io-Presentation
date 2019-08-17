const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = require('socket.io')(server);

app.use('/', (request, response) => {
    response.render('index.html');
});

server.listen(3000);

server.on('listening', () => {
    console.log('🛰 Server running 🛰');
    console.log('Data: ', JSON.stringify(server.address(), null, 2));
});

let messages = [];

io.on('connection', (socket) => {
    console.log('Socket connectado: ', socket.id);

    socket.emit('previewsMessages', messages);

    socket.on('sendMessage', (data) => {
        console.log('data: ', data);

        messages.push(data);
        socket.broadcast.emit('receivedMessage', data)
    });
});