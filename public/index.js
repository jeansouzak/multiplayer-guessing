$("#register").click(function (e) {
    var user = {name: $("#name").val() , word: $("#word").val() }
    if(user.name.trim() ==''){
        alert("Por favor, coloque um nome valido");
        return;
    }
    if(user.word.trim() ==''){
        alert("Por favor, coloque um palavra valida");
        return;
    }
});
