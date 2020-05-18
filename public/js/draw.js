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

    $('.color').click(function(){
        let color = $(this).attr('class').split(' ')[1];
        drawingData.color = color;
    });

    $('#sendWord').submit(function(e) {
        e.preventDefault();
        let body = {name: $("#username").val() , word : $("#guessword").val()};
        $("#guessword").val('');
        post = $.post('/send-word', body);
        post.done(function( player ) {
            document.getElementById('points').innerHTML = "Pontos: " + player.points;
        });
    });

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
    }

    function draw(line) {
        context.beginPath();
        context.lineWidth = line.lineWidth;
        context.strokeStyle = line.color;
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


