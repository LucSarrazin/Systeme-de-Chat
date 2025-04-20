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
            msg.id = result.insertId; // 🔥 Ajoute l'ID généré par MySQL
            msg.date = date; // Ajoute la date ici aussi pour l'afficher

            ChatController.io.emit("chat message", msg); // Envoie le msg complet avec id et date
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
        console.log("Modification demandée :", msg);

        const date = new Date().toISOString().slice(0, 19).replace("T", " ");

        MessageModel.changeMessage(msg.username, msg.message, date, msg.id, (err, result) => {
            if (err) {
                console.error("Erreur de modification :", err);
                socket.emit("modification refusée", "Une erreur est survenue.");
                return;
            }

            if (result.affectedRows === 0) {
                console.warn("Modification refusée : utilisateur non autorisé ou message inexistant");
                socket.emit("modification refusée", "Tu ne peux pas modifier ce message.");
                return;
            }

            console.log("Message modifié !");
            ChatController.io.emit("message modified", {
                id: msg.id,
                username: msg.username,
                message: msg.message,
                date: date
            });
        });
    }



}


module.exports = ChatController;
