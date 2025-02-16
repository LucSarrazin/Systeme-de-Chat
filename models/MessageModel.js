const db = require("../config/database");

class MessageModel {
    static saveMessage(username, message, date, callback) {
        const sql = "INSERT INTO message (Username, Message, Date) VALUES (?, ?, ?)";
        db.query(sql, [username, message, date], (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    }

    static getAllMessages(callback) {
        db.query("SELECT * FROM message", (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    }
}

module.exports = MessageModel;
