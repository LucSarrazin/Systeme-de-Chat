const { io } = require("socket.io-client");
// Connexion au serveur
const socket = io("http://localhost:3000");

// TEST 1 : Inscription d’un utilisateur
function testInscription() {
    return new Promise((resolve, reject) => {
        const user = { username: "testSocket", mdp: "123456" };
        console.log("🧪 Test #1 inscription...");

        socket.emit("creation", user);

        socket.once("registerSuccess", (message) => {
            console.log("✅ Succès inscription :", message);
            resolve();
        });

        socket.once("registerError", (message) => {
            console.error("❌ Erreur inscription :", message);
            resolve();
        });
    });
}

// TEST 2 : Connexion avec un utilisateur valide
function testConnexion() {
    return new Promise((resolve, reject) => {
        const user = { username: "testSocket", mdp: "123456" };
        console.log("🧪 Test #2 connexion...");

        socket.emit("connexion", user);

        socket.once("connexion", (username) => {
            console.log("✅ Connexion réussie pour :", username);
            resolve();
        });

        socket.once("loginError", (message) => {
            console.error("❌ Erreur de connexion :", message);
            reject(message);
        });
    });
}

// TEST 3 : Envoi d'un message
function testMessage() {
    return new Promise((resolve) => {
        const msg = { username: "testSocket", message: "Hello via test socket !" };
        console.log("🧪 Test #3 envoi message...");

        socket.emit("chat message", msg);

        socket.once("chat message", (received) => {
            console.log("✅ Message reçu :", received);
            resolve();
        });
    });
}

function testModification() {
    return new Promise((resolve, reject) => {
        const msg = { username: "testSocket", message: "Ceci est un teste de modification !" };
        console.log("🧪 Test #4 Envoi d'un message et modification...");

        // Émettre le message
        socket.emit("chat message", msg);

        // Écouter le message reçu
        socket.once("chat message", (received) => {
            const id = received.id; // Récupérer l'ID du message reçu
            console.log("✅ Message reçu :", received);

            // Émettre la modification une fois que l'ID est disponible
            socket.emit("modifier", {
                id: id,
                username: msg.username,
                message: "Ceci est la modification effectuée !"
            });

            // Définir un délai d'attente pour la modification
            const timeout = setTimeout(() => {
                reject(new Error("⏳ Délai d'attente dépassé pour la modification du message."));
            }, 5000); // 5 secondes

            // Écouter la confirmation de la modification
            socket.on('message modified', (modifiedReceived) => {
                clearTimeout(timeout); // Annuler le délai d'attente
                console.log("✅ Message modifié reçu :", modifiedReceived);
                resolve();
            });
        });
    });
}

// TEST 5 : Simuler les échanges de messages avec plusieurs sockets (là juste deux)
function testEchangeEntreDeuxClients() {
    return new Promise((resolve) => {
        console.log("🧪 Test #5 echange Entre Deux Clients");
        const socket2 = io("http://localhost:3000");

        socket2.on("chat message", (msg) => {
            console.log("📩 Socket2 a reçu :", msg);
            socket2.disconnect();
            resolve();
        });

        const msg = { username: "testSocket", message: "Test entre 2 clients" };
        socket.emit("chat message", msg);
        socket.once("chat message", (received) => {
            console.log("✅ Message reçu avec succès :", received);
        });
    });
}

// Exécution des tests de manière séquentielle
async function runTests() {
    try {
        await testInscription();
        await testConnexion();
        await testMessage();
        await testModification();
        await testEchangeEntreDeuxClients();
    } catch (error) {
        console.error("Un test a échoué :", error);
    } finally {
        socket.disconnect(); // Déconnexion du socket après les tests
    }
}

runTests();