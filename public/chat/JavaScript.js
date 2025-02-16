$(function (){
    const socket = io();

    window.onload = function() {
        socket.emit("loadMessage");
        socket.on('loadMessage', function (msg) {

            msg.forEach((element) =>  $("#messages").prepend($("<p id='Messages'>").text("L'utilisateur " + element.Username +  " le " + generateDatabaseDateTime(element.Date) + " à dit : " + element.message)),$("#messages").prepend($("<br>").text("")));


            function generateDatabaseDateTime(dates) {
                const date = new Date(dates);
                return date.toLocaleString("fr-FR", { timeZone: "Europe/Paris" }).replace(" ", " à ");
            }
        })
    };



    $("form").submit(function (e){
        e.preventDefault();
        socket.emit("chat message", {
            username:  $("#Username").val(),
            message:  $("#msg").val(),
            date: new Date().toLocaleString()
        });
        $("#msg").val("");
        return false;
    });
    socket.on('chat message', function (msg) {
        $("#messages").prepend($("<p>").text("L'utilisateur " + msg.username +  " à " + msg.date + " à dit : " + msg.message))
    })


    socket.on('loadMessage', function (msg) {
        $("#messages").prepend($("<p>").text("L'utilisateur " + msg.username +  " à " + msg.date + " à dit : " + msg.message))
    })

});
