const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 5000;
const host = 'localhost';

var names = [];
var words = [];
var players = [];

//TODO: User this object to print final point, and give points do the righ user
var user = {name: null, word: null, points: 0}

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/draw', (req, res) => {
  if (!(names.indexOf(req.query.name) > -1)) {
    user.name = req.query.name
    user.word = req.query.word
    players.push(user);
    names.push(req.query.name);
    words.push(req.query.word);
    res.render('draw', user);
  } else{
    //TODO: error message
    res.redirect('/');
  }
})

io.on('error', e => console.log(e));

io.on('connection', function (socket) {
  socket.on('draw', function (line) {
    socket.broadcast.emit('draw', line);
  })

  socket.on('send word', function(obj, callback){
    if((words.indexOf(obj.guessWord) > -1)){
      var thisUser = players.find(user => user.name = obj.name);
      thisUser.points++;
      socket.emit('send points', thisUser)
      callback(true);
    }else {
      callback(false);
    }
  })
});

http.listen(port, host, function () {
  console.log('Server HTTP started. Listening on *:' + port);
});
