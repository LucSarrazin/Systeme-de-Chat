const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

class AuthController {
    static register(socket, user) {
        console.log("Création de compte : ", user);

        UserModel.getUserByUsername(user.username, (err, existingUser) => {
            if (err) return console.error("Erreur SQL :", err);

            if (existingUser) {
                console.error("L'utilisateur existe déjà !");
                return;
            }

            bcrypt.hash(user.mdp, 10, (err, hash) => {
                if (err) return console.error("Erreur lors du hash :", err);

                UserModel.createUser(user.username, hash, (err, result) => {
                    if (err) return console.error("Erreur lors de l'inscription :", err);
                    console.log("Utilisateur créé !");
                });
            });
        });
    }

    static login(socket, user) {
        console.log("Tentative de connexion :", user);

        UserModel.getUserByUsername(user.username, (err, existingUser) => {
            if (err) return console.error("Erreur SQL :", err);

            if (!existingUser) {
                console.error("Utilisateur non trouvé !");
                return;
            }

            bcrypt.compare(user.mdp, existingUser.MDP, (err, match) => {
                if (err) return console.error("Erreur de vérification :", err);

                if (match) {
                    console.log("Connexion réussie !");
                    socket.emit("connexion", user.username);
                } else {
                    console.error("Mot de passe incorrect !");
                }
            });
        });
    }
}

module.exports = AuthController;
