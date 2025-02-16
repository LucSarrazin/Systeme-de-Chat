const db = require("../config/database");

class UserModel {
    static getUserByUsername(username, callback) {
        db.query("SELECT * FROM data WHERE Username = ?", [username], (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result[0]);
        });
    }

    static createUser(username, password, callback) {
        db.query("INSERT INTO data (Username, MDP) VALUES (?, ?)", [username, password], (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    }
}

module.exports = UserModel;
