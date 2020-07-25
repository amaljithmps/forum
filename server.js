const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { urlencoded } = require('express');
require('dotenv/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session)


//database
mongoose.connect(process.env.DB_connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => { console.log('Database Connection Established...')})
    .catch(err => console.error(err));

//Middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(cookieParser('1672345-890-09876-54321'));
app.use(session({
    name: 'session-id',
    secret: '1672345-890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

//start server
app.listen(process.env.PORT || 3000, () => console.log("Server Connection Established"));


//authorization
function auth(req, res, next){
    console.log(req.session);
    if(!req.session.user){
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        } else {
            var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
            var username = auth[0];
            var password = auth[1];
            
            if(username === 'admin' && password === 'password') {
                req.session.user = 'admin';
                next();
            } else {
                var err = new Error('You are not authenticated!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                return next(err);
            }
        }
    } else {
        if(req.session.user === 'admin') {
            next();
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
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