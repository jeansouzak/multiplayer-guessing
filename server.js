const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 5000;
const host = 'localhost';

var names = [];
var words = [];

//TODO: User this object to print final point, and give points do the righ user
//var user = {name: null, word: null, points: 0}

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/draw', (req, res) => {
  if (!(names.indexOf(req.query.name) > -1)) {
    names.push(req.query.name);
    words.push(req.query.word);
    res.render('draw', { name: req.query.name, word: req.query.word });
  } else{
    //TODO: error message
    res.redirect('/');
  }
})
//History with drawed lines to render on new client connection
const drawedList = [];

io.on('error', e => console.log(e));

io.on('connection', function (socket) {
  socket.on('draw', function (line) {
    socket.broadcast.emit('draw', line);
  })

  socket.on('send word', function(word, callback){
    if((words.indexOf(word.msg) > -1)){
      callback(true);
    }else {
      callback(false);
    }
  })
});

http.listen(port, host, function () {
  console.log('Server HTTP started. Listening on *:' + port);
});
