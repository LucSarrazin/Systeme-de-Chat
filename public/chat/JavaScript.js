const socket = io();

let meSending = false;
let id;

$(function (){



    window.onload = function() {
        socket.emit("loadMessage");
        socket.emit("Utilisateur Connecté", (username));
        socket.on('loadMessage', function (msg) {

            msg.forEach((element) =>  $("#messages").prepend($("<p id='Messages'>").text("L'utilisateur " + element.Username +  " le " + generateDatabaseDateTime(element.Date) + " à dit : " + element.message)),$("#messages").prepend($("<br>").text("")));


            function generateDatabaseDateTime(dates) {
                const date = new Date(dates);
                return date.toLocaleString("fr-FR", { timeZone: "Europe/Paris" }).replace(" ", " à ");
            }
        })

        // Utilisateurs connectées mis à jours
        socket.on("updateUsers", function (userList) {
            console.log("Liste des utilisateurs mise à jour :", userList);

            // Eviter les doubles
            $(".user-connected").empty();

            userList.forEach(username => {
                $(".user-connected").prepend($("<p>").text(username));
            });
        });

    };


    socket.on('Utilisateur Connecté', function (username) {
        console.log("utilisateur reçu dans le javascript.js : " + username)
        $(".user-connected").prepend($("<p>").text(username))
    })
    socket.on('deconnexion', function (username) {
        console.log("utilisateur enlever dans le javascript.js : " + username)
        $(".user-connected p").filter(function () {
            return $(this).text() === username;
        }).remove();
    })


    $("#deconnecter").on("click", function() {
        socket.emit("deconnexion");
        window.location.assign(`/`);
    });

    let typingTimeout;

    $("#msg").on("input", function() {
        clearTimeout(typingTimeout);

        console.log("Quelqu'un écrit : ");
        socket.emit("typing", $("#Username").val());


        typingTimeout = setTimeout(function() {
            console.log("Quelqu'un a arrêté d'écrire !");
            socket.emit("typing", null);
        }, 2000); // 2 secondes d'attentes
    });


    socket.on('typing', function (user) {
        if(user != null){
            document.getElementById("typing").value = "L'utilisateur " + user + " est en train d'écrire...";
        }else{
            document.getElementById("typing").value = "";
        }
    })


    $("form").submit(function (e){
        if(document.getElementById("msg") != null){
            if(document.getElementById("msg").value !== "") {
                e.preventDefault();
                meSending = true;
                socket.emit("chat message", {
                    username: $("#Username").val(),
                    message: $("#msg").val(),
                    date: new Date().toLocaleString()
                });
                $("#msg").val("");
                return false;
            }
            else{
                console.log("message non transmis car vide");
                alert("Message vide !");
            }
        }
    });

    socket.on('chat message', function (msg) {
        id = msg.id;
        $("#messages").prepend(
            $("<div style='display: flex; align-items: center;'>").append(
                $("<p style='margin: 0; padding-right: 10px;'>").text("L'utilisateur " + msg.username + " à " + msg.date + " à dit : " + msg.message),
                $("<button id='modifier' style='height:50px; width: 50px;'>").html("<span class='material-icons'>&#xf88d;</span>")
            )
        );
        if(meSending === false){
            play();
        }
        meSending = false;
    })


    $("#messages").on("click", "#modifier", function() {
        console.log("Clicked Modify");
        socket.emit("modifier", {
            id : id,
            message: $("#msg").val(),
            date: new Date().toLocaleString()
        });
    });

    socket.on('loadMessage', function (msg) {
        $("#messages").prepend($("<p>").text("L'utilisateur " + msg.username +  " à " + msg.date + " à dit : " + msg.message))
    })


    function play() {
        var audio = new Audio('https://cdn.pixabay.com/audio/2024/11/27/audio_c91ef5ee90.mp3');
        audio.play();
    }

});

