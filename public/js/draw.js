document.addEventListener("DOMContentLoaded", function () {
    const CANVAS_UPDATE_RATE = 25; //Miliseconds
    const width = window.innerWidth;
    const height = window.innerHeight;

    const drawingData = {
        clicked: false,
        moved: false,
        prev_pos: {},
        pos: { x: 0, y: 0 },
        lineWidth: 2, //TODO: Create dynamic pallete
        color: "black"
    };

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const socket = io.connect();

    setupCanvas();
    setupSocket();
    startLoop();

    //Not Changing color, 
    // var colors = document.getElementsByClassName('color');
    // for (var i = 0; i < colors.length; i++){
    //     colors[i].addEventListener('click', onColorUpdate, false);
    // }
    
    // function onColorUpdate(e){
    //     drawingData.color = e.target.className.split(' ')[1];
    // }

    function setupCanvas() {
        canvas.width = width;
        canvas.height = height;

        canvas.onmousedown = function (e) {
            drawingData.clicked = true;
        };
        canvas.onmouseup = function (e) {
            drawingData.clicked = false;
        };
        canvas.onmousemove = function (e) {
            drawingData.pos.x = e.clientX / width;
            drawingData.pos.y = e.clientY / height;
            drawingData.moved = true;
        };
    }

    function setupSocket() {
        socket.on('draw', function(line) {
            draw(line);
        });

        $("form#chat").submit(function (e) {
            e.preventDefault();
            var guessWord = $(this).find("#guess_word").val();
            var name = $(this).find("#user_name").val();
            socket.emit("send word", { guessWord: guessWord, name: name}, function (cb) {
                 $("form#chat #guess_word").val("");
            });
            socket.on('send points', function(thisUser){
                document.getElementById('points').innerHTML = "Pontos: " + thisUser.points.toString();
            })
       });
    }

    function draw(line) {
        context.beginPath();
        context.lineWidth = line.lineWidth;
        context.strokeColor = line.color;
        context.moveTo(line.end.x * width, line.end.y * height);
        context.lineTo(line.start.x * width, line.start.y * height);
        context.stroke();
    }

    function startLoop() {
        if (drawingData.clicked && drawingData.moved && Object.keys(drawingData.prev_pos).length != 0) {
            let line = {
                start: drawingData.prev_pos,
                end: drawingData.pos,
                color: drawingData.color,
                lineWidth: drawingData.lineWidth 
            }
            socket.emit('draw', line);
            draw(line)
            drawingData.moved = false;
        }
        drawingData.prev_pos = { x: drawingData.pos.x, y: drawingData.pos.y };
        setTimeout(startLoop, CANVAS_UPDATE_RATE);
    }
});


