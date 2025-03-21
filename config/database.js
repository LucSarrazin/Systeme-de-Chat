const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydata",
    charset: "utf8"
});

db.connect(err => {
    if (err) {
        console.error("Erreur de connexion à MySQL: ", err);
        return;
    }
    console.log("✅ Connecté à la base de données MySQL");
});

module.exports = db;
