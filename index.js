const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");

const db = require("./config/database");
const AuthController = require("./controllers/authController");
const ChatController = require("./controllers/chatController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let connected = false;

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/chat/:username", (req, res) => {
    if(connected !== false) {
        res.sendFile(__dirname + "/public/chat/PageTestIndex.html")
    }
    else{
        res.redirect('/');
    }
});

ChatController.init(io);
let usersConnected = new Set();
io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");


    socket.on('Utilisateur Connecté',(username) => {
        usersConnected.add(username);
        socket.emit("updateUsers", Array.from(usersConnected));
        console.log("L'utilisateur reçu dans l'index.js est : ", username);
        socket.broadcast.emit("Utilisateur Connecté",username);
        const usernames = username;
        socket.on("disconnect", () => {
            console.log("Un utilisateur s'est déconnecté")
            socket.broadcast.emit("deconnexion", usernames);
            connected = false;
        });

    })


    socket.on("deconnexion",(username)=>{
        usersConnected.delete(username);
        socket.emit("deconnexion", username)
        socket.emit("updateUsers", Array.from(usersConnected));
        connected = false;
    })

    socket.on("typing",(user)=>{
        socket.broadcast.emit("typing", user)
    })
    socket.on("creation", (user) => AuthController.register(socket, user));
    socket.on("connexion", (user) => {
        connected = true;
        AuthController.login(socket, user)
    });
    socket.on("chat message", (msg) => ChatController.sendMessage(socket, msg));
    socket.on("loadMessage", () => ChatController.loadMessages(socket));
    socket.on("modifier", () => ChatController.modifyMessages(socket, msg));
});

server.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));