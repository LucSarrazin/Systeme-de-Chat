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

    static changeMessage(username, message, date, id, callback) {
        const sql = "UPDATE message SET Message = ?, Date = ? WHERE Id = ? AND Username = ?";
        db.query(sql, [message, date, id, username], (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    }

}

module.exports = MessageModel;
