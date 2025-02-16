
$(function (){
    const socket = io();
    $("#creation").submit(function (e){
        e.preventDefault();
        socket.emit("creation", {
            username:  $("#userCreation").val(),
            mdp:  $("#mdpCreation").val()
        });
        $("#userCreation","#mdpCreation").val("");
        return false;
    });
    socket.on('creation', function (user) {
        $("#message").append($("<p>").text(user.username))
        $("#message").append($("<p>").text(user.mdp))

    })

    $("#connexion").submit(function (e){
        e.preventDefault();
        socket.emit("connexion", {
            username:  $("#userConnexion").val(),
            mdp:  $("#mdpConnexion").val()
        });
        $("#userConnexion","#mdpConnexion").val("");
        return false;
    });
    socket.on('connexion', function (user) {
        window.location.assign(`/chat/${user}`);

    })

});
