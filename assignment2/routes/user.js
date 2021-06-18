var express = require("express");
var mongoose = require("mongoose");
var passwordHash = require("password-hash");
var app = express();
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
var { auth } = require("../config/auth");
var { conn } = require("../config/db");
const user = require('../models/User');
var async = require("async");
app.use(cookieParser());
const saltRounds = 10;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.json());

app.post("/user/register", async function (req, res) {
    console.log(req.body.username);
    const salt = await bcrypt.genSalt();
    const userPassword = await bcrypt.hash(req.body.password, salt);
  
    if (req.body.password !== req.body.confirmpassword) {
      res.send("password not match");
    } else {
      const user_post = new user({
        username: req.body.username,
        password: userPassword,
        email: req.body.email,
      });
      user_post.save(function (err, row) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          res.status(200).send("saved succesfully");
        }
      });
    }
  });
  app.post("/user/login", async function (req, res) {
    user.findOne({ username: req.body.username }, async function (err, results) {
      var name = results.username;
      var pass = results.password;
      var userId = results._id;
      var input_password = pass.toString();
      var user_password = req.body.password;
      var tokenId = userId.toString();
      if (await bcrypt.compare(user_password, input_password)) {
        res.header("token", tokenId);
        res.status(200).json({ token: tokenId });
      } else {
        res.status(500).send('password not match');
      }
    });
  });
  
  app.get("/user/get", auth, async function (req, res) {
    res.json(req.user);
  });
  
  app.put("/user/delete/", auth, async function (req, res) {
    var user_id = req.user.id;
    await user.deleteOne({ _id: user_id }, function (err, results) {
      if (err) {
        res.status(501).send("no user mathch");
      }
      console.log(results);
      res.status(200).send("user deleted");
    });
  });
  
  app.get("/user/list/:id", async function (req, res) {
    if (req.params.id == 1) {
      skip = 0;
    } else {
      var skip = req.params.id * 10;
    }
    console.log(skip);
    user
      .find()
      .skip(skip)
      .limit(5)
      .exec(function (err, result) {
        if (err) {
          res.send(err);
        }
        console.log(result);
        res.send(result);
      });
  });

  module.exports = app;
