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

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/chat/:username", (req, res) => res.sendFile(__dirname + "/public/chat/PageTestIndex.html"));

ChatController.init(io);

io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    socket.on("disconnect", () => console.log("Un utilisateur s'est déconnecté"));

    socket.on("creation", (user) => AuthController.register(socket, user));
    socket.on("connexion", (user) => AuthController.login(socket, user));
    socket.on("chat message", (msg) => ChatController.sendMessage(socket, msg));
    socket.on("loadMessage", () => ChatController.loadMessages(socket));
});

server.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));