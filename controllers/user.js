var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());

router.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

router.post('/signup', (req, res, next) => {
    User.findOne({ username: req.body.username })
    .then((ser) => {
        if(ser != null) {
            var err = new Error('User '+ req.body.username+' already exists.');
            err.status = 403;
            next(err);
        }
        else {
            User.create({
                username: req.body.username,
                password: req.body.password });
        }
    })
    .then((user) => {
        res.statusCode= 200;
        res.setHeader('Content-Type','application/json');
        res.json({status: 'Registration Successfull'});
    }, (err) => next(err))
    .catch((err) => next(err));
});


router.post('/login', (req, res, next) => {
    console.log(req.session.user);
    if(!req.session.user) {
      var authHeader = req.headers.authorization;
      
      if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
    
      User.findOne({username: username})
      .then((user) => {
        if (user === null) {
          var err = new Error('User ' + username + ' does not exist!');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          var err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch((err) => next(err));
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
  })
  
  router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });

module.exports = router;