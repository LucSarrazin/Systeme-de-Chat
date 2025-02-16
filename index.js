const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '1234';
const someOtherPlaintextPassword = 'not_bacon';



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Accepte toutes les connexions
    }
});

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change selon ta config
    password: "", // Change selon ta config
    database: "mydata",
    charset: "utf8"
});



app.use(express.static("public"));


db.connect(err => {
    if (err) {
        console.error("Erreur de connexion à MySQL: ", err);
        return;
    }
    console.log("Connecté à la base de données MySQL");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname+"/public/index.html");
})

app.get('/chat/:username', function (req, res) {
    console.log("l'username est : " + req.params.username);
    res.sendFile(__dirname+"/public/chat/PageTestIndex.html");
})

// Gestion des connexions WebSocket
io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });

    // Création du compte
    socket.on("creation", (user) => {
        console.log("creation : ", user);

        db.query("SELECT Username FROM data", (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des comptes", err);
            } else {
                console.log(results);
                if(!results === user.username){
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        bcrypt.hash(user.mdp, salt, function(err, hash) {
                            if(err){
                                console.error("Le hash à échoué !");
                            }
                            else{
                                console.log("Hash réussi !");

                                const sql = "INSERT INTO data (Username, MDP) VALUES (?, ?)";
                                db.query(sql, [user.username, hash], (err, results) => {
                                    if (err) {
                                        console.error("Erreur lors de la sauvegarde du compte", err);
                                    } else {
                                        console.log(results);
                                    }
                                });
                            }
                        });
                    });
                }
                else{
                    console.error("L'utilisateur existe déjà ! ")
                }
            }
        });
    });

    // Connexion au compte
    socket.on("connexion", (user) => {
        console.log("connexion : ", user);

        db.query("SELECT * FROM data", (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des messages", err);
            } else {
                console.log(results);
                if(results.find((element) => element.Username === user.username)){
                    console.log("Utilisateur trouvé !");
                    let hash = results.find((element) => element.MDP && element.Username === user.username);
                    console.log(hash.MDP)
                    if(bcrypt.compareSync(user.mdp, hash.MDP)){
                        console.log("Connexion réussi !");
                        socket.emit("connexion",user.username);
                    }else{
                        console.error("Mauvais Mot De Passe ! ");
                    }
                }
                else{
                    console.error("L'utilisateur n'existe pas ! ");
                }
            }
        });
    });

    // Sauvegarder et envoyer les messages
    socket.on("chat message", (msg) => {
        console.log("message : ", msg);

        let datenow = new Date();

        console.log(datenow); // "2021-07-28T18:11:11.282Z"
        console.log(generateDatabaseDateTime(datenow)); // "2021-07-28 14:11:33"
        let date = generateDatabaseDateTime(msg.date);
        function generateDatabaseDateTime(dates) {
            console.log("Valeur reçue pour la date :", dates); // Debug

            if (!dates) {
                console.error("Date fournie invalide :", dates);
                return null;
            }

            // Si c'est un timestamp numérique
            if (!isNaN(dates)) {
                dates = new Date(parseInt(dates));
            } else if (typeof dates === "string" && dates.includes("T")) {
                // Format ISO (ex: "2025-02-16T03:07:01.191Z")
                dates = new Date(dates);
            } else if (typeof dates === "string" && dates.includes("/")) {
                // Format européen (ex: "16/02/2025 04:07:01")
                let [day, month, yearTime] = dates.split("/");
                let [year, time] = yearTime.split(" ");
                dates = new Date(`${year}-${month}-${day}T${time}`);
            } else {
                // Dernier recours
                dates = new Date(dates);
            }

            if (isNaN(dates.getTime())) {
                console.error("Date invalide après conversion :", dates);
                return null;
            }

            // Formatter en "YYYY-MM-DD HH:MM:SS" pour MySQL
            const year = dates.getFullYear();
            const month = String(dates.getMonth() + 1).padStart(2, "0");
            const day = String(dates.getDate()).padStart(2, "0");
            const hours = String(dates.getHours()).padStart(2, "0");
            const minutes = String(dates.getMinutes()).padStart(2, "0");
            const seconds = String(dates.getSeconds()).padStart(2, "0");

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        const sql = "INSERT INTO message (Username, Message,Date) VALUES (?, ?, ?)";
        db.query(sql, [msg.username, msg.message,date], (err, results) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde des messages", err);
            } else {
                console.log(results);
            }
        });

        io.emit('chat message', msg);
    });

    // Charger les messages
    socket.on("loadMessage", () => {
        console.log("Loading Messages");

        db.query("SELECT * FROM message", (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des messages", err);
            } else {
                console.log(results);
                io.emit('loadMessage', results);
                }
        });
    });


});







// Démarrer le serveur
server.listen(3000, () => {
    console.log("Serveur en écoute sur http://localhost:3000");
});
