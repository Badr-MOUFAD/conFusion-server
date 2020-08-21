var express = require('express');
const bodyParser = require("body-parser");
var router = express.Router();

const Users = require("../models/users");

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next) => {
  Users.findOne( { username: req.body.username })
  .then((user) => {
    if(!user) {
      return Users.create(req.body);
    }

    const err = new Error(`Username ${req.body.username} already exist`);
    res.statusCode = 403;
    next(err);
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ status: "Registered successfully", user: user});
  })
  .catch((err) => {
    next(err);
  })
});

router.post("/login", (req, res, next) => {
  if(req.session.user) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are already authenticated");
    next();
    return ;
  }

  if(req.headers.authorization) {
    const [username, password] = new Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString().split(":");

    Users.findOne({ username: username })
    .then((user) => {
      if(user) {
        if(user.password === password) {
          res.statusCode = 200;
          req.session.user = "authenticated";

          res.setHeader("Content-Type", "text/plain");
          res.end(`Welcome ${username}!`);
        }
        else {
          const err = new Error("Incorrect password");
          err.status = 403;
          next(err);
        }
      }
    })
    .catch((err) => {
      next(err);
    });

    return ;
  }

  const err = new Error(req.headers.authorization);
  err.status = 401;
  res.setHeader('WWW-Authenticate', 'Basic');
  next(err);
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
