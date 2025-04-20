
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

    // Création
    socket.on("registerError", function (message) {
        $("#creation .feedback").text(message).css("color", "red");
    });

    socket.on("registerSuccess", function (message,user) {
        $("#creation .feedback").text(message).css("color", "green");
        socket.emit("connexion", {
            username:  user.username,
            mdp:  user.mdp
        });
    });
    socket.on('connexion', function (user) {
        window.location.assign(`/chat/${user}`);

    })

// Connexion
    socket.on("loginError", function (message) {
        $("#connexion .feedback").text(message).css("color", "red");
    });


});
