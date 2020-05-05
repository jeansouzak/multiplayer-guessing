const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 5000;
const host = 'localhost';

app.use(express.static(__dirname + '/public'));

//History with drawed lines to render on new client connection
const drawedList = [];

io.on('error', e => console.log(e));

io.on('connection', function (socket) {
  socket.on('draw', function (line) {
    socket.broadcast.emit('draw', line);
  });
});

http.listen(port, host, function () {
  console.log('Server HTTP started. Listening on *:' + port);
});
