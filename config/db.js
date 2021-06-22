var mongoose = require("mongoose");
var conn = mongoose.createConnection(
    "mongodb://localhost:27017/newuser",
    {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    },
    function (err, db) {
        if (err) {
            console.log("Connection with database not established");
        }
    }
);

exports.conn = conn;