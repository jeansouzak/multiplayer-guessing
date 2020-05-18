const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const port = 5000;
const host = 'localhost';
const user = require('./public/js/user'); 
const tools = require('./app/tools');
const players = [];
const drawedList = []; // TODO: History with drawed lines to render on new client connection

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/draw', (req, res) => {
    let newUser = new user(req.body.name, req.body.word);
    let player = tools.findPlayer(newUser.name, players);
    if(!player){
      players.push(newUser);
      res.render('draw', newUser);
    } else {
    //TODO: error message
      res.redirect('/');
  }
})

app.post('/send-word', (req, res) => {
    if(tools.hasWord(req.body.word, players)){
      thisUser = tools.findPlayer(req.body.name, players);
      //TODO: Rules to not guess your own word
      if(thisUser){
        thisUser.points++;
      }
      res.send(thisUser);
    }
});

app.post('/ranking', (req, res) =>{
  players.sort((a, b) => b.points - a.points);
  res.render('ranking', {players : players});
});

io.on('error', e => console.log(e));

io.on('connection', function (socket) {
  socket.on('draw', function (line) {
    socket.broadcast.emit('draw', line);
  })
});

http.listen(port, host, function () {
  console.log('Server HTTP started. Listening on *:' + port);
});