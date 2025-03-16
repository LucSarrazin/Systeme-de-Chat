const MessageModel = require("../models/MessageModel");

class ChatController {
    static init(io) {
        ChatController.io = io; // Stocke l'instance de io
    }

    static sendMessage(socket, msg) {
        console.log("Message reçu :", msg);

        const date = new Date().toISOString().slice(0, 19).replace("T", " ");

        MessageModel.saveMessage(msg.username, msg.message, date, (err, result) => {
            if (err) return console.error("Erreur d'enregistrement :", err);

            console.log("Message sauvegardé !");
            ChatController.io.emit("chat message", msg); // Utilisation de io.emit
        });
    }

    static loadMessages(socket) {
        console.log("Chargement des messages...");

        MessageModel.getAllMessages((err, messages) => {
            if (err) return console.error("Erreur de récupération :", err);

            socket.emit("loadMessage", messages);
        });
    }

    static modifyMessages(socket, msg) {
        console.log("Message reçu :", msg);

        const date = new Date().toISOString().slice(0, 19).replace("T", " ");

        MessageModel.changeMessage(msg.username, msg.message, date, (err, result) => {
            if (err) return console.error("Erreur d'enregistrement :", err);

            console.log("Message sauvegardé !");
            ChatController.io.emit("chat message", msg); // Utilisation de io.emit
        });
    }

}


module.exports = ChatController;
