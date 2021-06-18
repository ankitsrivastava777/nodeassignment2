var {conn} = require("./db");
var {user} = require("../models/User")

var auth = async function authenticateToken(req, res, next) {
    var user_id = req.headers.token;
    user.findOne({ _id: user_id }, function (err, userDetails) {
        if (userDetails && userDetails._id) {
            req.user = userDetails;
            next();
        } else {
            res.status(500).json({
                message: "user not found",
            });
        }
    });
}

exports.auth = auth;
