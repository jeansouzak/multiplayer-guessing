const socket = io.connect();

$("#data").click(function (e) {
    e.preventDefault();
    var user = {name: $("#name").val() , word: $("#word").val() }
    if(user.name.trim() ==''){
        alert("Por favor, coloque um nome valido");
        return;
    }
    if(user.word.trim() ==''){
        alert("Por favor, coloque um palavra valida");
        return;
    }
    socket.emit("start", user, function (cb) {
        if (!cb){
            allowSubmit = false;
            alert("Nome já utilizado nesta sala");
            return;
        }
        window.location.href = '/draw?name=' + user.name + 'word=' + user.word;
    });
});