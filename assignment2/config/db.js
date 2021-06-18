var express = require("express");
var mongoose = require("mongoose");
var passwordHash = require("password-hash");
var app = express();
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
            console.log("no");
        }
    }
);

exports.conn = conn;