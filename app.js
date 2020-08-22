var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var Mongoose = require("mongoose");

var passport = require("passport");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require("./routes/dishRouter");
var leaderRouter = require("./routes/leaderRouter");
var promoRouter = require("./routes/promoRouter");

var authentication = require("./authentication");
var config = require("./config");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Mongo database 
const url = config.mongoUrl;
const connection = Mongoose.connect(url);

connection
.then((res) => {
  console.log("Mongo server is running ...");
})
.catch((err) => {
  console.log(err.message);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

/* app.use((req, res, next) => {
  if(req.user) {
    next();
    return ;
  }

  const err = new Error("You are not authorized");
  err.status = 401;
  next(err);
}); */

app.use("/dishes", dishRouter);
app.use("/leaders", leaderRouter);
app.use("/promotions", promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
