const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 5000;
const host = 'localhost';

var users = [];
//TODO: See rules for words
var words = [];

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/draw', (req, res) => {
  res.render('draw', { name: req.query.name, word: req.query.word });
})

//History with drawed lines to render on new client connection
const drawedList = [];

io.on('error', e => console.log(e));

io.on('connection', function (socket) {
  socket.on('draw', function (line) {
    socket.broadcast.emit('draw', line);
  })

  socket.on("start", function (user, callback) {
    if (!(user.name in users)) {
      socket.name = user.name;
      users[user.name] = socket;
      callback(true);
    } else {
      callback(false);
    }
  })

});

http.listen(port, host, function () {
  console.log('Server HTTP started. Listening on *:' + port);
});
