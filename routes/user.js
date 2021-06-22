var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var { auth } = require("../config/auth");
var { conn } = require("../config/db");
const user = require("../models/User");
app.use(express.json());

app.post("/user/register", async function (req, res) {
  const salt = await bcrypt.genSalt();
  const userPassword = await bcrypt.hash(req.body.password, salt);
  if (req.body.password !== req.body.confirmpassword) {
    res.status(500).json({
      message: "password not matched",
    });
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
        res.status(200).json({
          message: "user saved successfully",
        });
      }
    });
  }
});
app.post("/user/login", async function (req, res) {
  user.findOne({ username: req.body.username }, async function (err, results) {
    var pass = results.password;
    var userId = results._id;
    var input_password = pass.toString();
    var user_password = req.body.password;
    var tokenId = userId.toString();
    if (await bcrypt.compare(user_password, input_password)) {
      res.header("token", tokenId);
      res.status(200).json({ token: tokenId });
    } else {
      res.status(500).send("password not match");
    }
  });
});

app.get("/user/get", auth, async function (req, res) {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

app.put("/user/delete/", auth, async function (req, res) {
  var user_id = req.user.id;
  await user.deleteOne({ _id: user_id }, function (err, results) {
    if (err) {
      res.status(501).send("no user mathch");
    }
    res.status(200).send("user deleted");
  });
});

app.get("/user/list/:id/:page", function (req, res) {
  page = Number(req.params.page);
  if (req.params.id == 1) {
    skip = 0;
  } else {
    var skip = req.params.id * 10 - 10;
  }
  user
    .find()
    .skip(skip)
    .limit(page)
    .exec(function (err, result) {
      if (err) {
        res.send(err);
      }
      res.send(result);
    });
});

module.exports = app;
