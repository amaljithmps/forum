const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');


const config = require('./config');
const authenticate = require('./authenticate');



//database
mongoose.connect(process.env.DB_connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => { console.log('Database Connection Established...')})
    .catch(err => console.error(err));

//Middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());



//models
const ForumModel = require('./models/forumModel');

//controllers
const forumControl = require('./controllers/forumControl');
const userRouter = require('./controllers/user');

//start server
app.listen(process.env.PORT || 3000, () => console.log("Server Connection Established"));


//app.use(cookieParser('12345-67890-09876-54321'));
/*app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));*/

app.use(passport.initialize());
//app.use(passport.session());


app.use('/',userRouter);
app.use(express.static(path.join(__dirname, 'public')));


forumControl(app,ForumModel);


