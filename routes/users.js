var express = require('express');
var bodyParser = require("body-parser");
var passport = require("passport");

var router = express.Router();

const authenticate = require("../authentication");

const Users = require("../models/users");

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next) => {
  Users.register({ username: req.body.username }, req.body.password,
    (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err});
        return ;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Registration Successful!' });
    });
});

router.post("/login", passport.authenticate("local"), function (req, res) {
  const token = authenticate.getToken({_id: req.user._id});

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get("/logout", (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
    return ;
  }

  const err = new Error("You are not logged in");
  err.status = 403;
  next(err);
});

module.exports = router;
