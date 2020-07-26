const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);


//database
mongoose.connect(process.env.DB_connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => { console.log('Database Connection Established...')})
    .catch(err => console.error(err));

//Middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

const indexRouter = require('./controllers/index');
const userRouter = require('./controllers/user');
app.use('/',indexRouter);
app.use('/users',userRouter);

//start server
app.listen(process.env.PORT || 3000, () => console.log("Server Connection Established"));


//app.use(cookieParser('12345-67890-09876-54321'));

//authorization


function auth (req, res, next) {
    console.log(req.session);
  if(!req.session.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  }
  else {
    if (req.session.user === 'authenticated') {
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
}

app.use(auth);

//models
const ForumModel = require('./models/forumModel');

//controllers
const forumControl = require('./controllers/forumControl');
forumControl(app,ForumModel);


