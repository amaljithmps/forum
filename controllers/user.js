var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if(err) {
			res.statusCode= 500;
			res.setHeader('Content-Type','application/json');
			res.json({err: err});
        }
        else {
          if(req.body.firstname) {
            user.firstname = req.body.firstname;
          }
          if(req.body.firstname) {
            user.lastname = req.body.lastname;
          }
          user.save((err, user) => {
            if(err){
              res.statusCode= 500;
              res.setHeader('Content-Type','application/json');
              res.json({err: err});
              return ;
            }
            passport.authenticate('local')(req, res, () =>{
              res.statusCode= 200;
              res.setHeader('Content-Type','applircation/json');
              res.json({ success: true, status: 'Registration Successfull'});
            });
          });
    	  }
    });
});


router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {
	var token = authenticate.getToken({ _id: req.user._id });

	res.statusCode= 200;
	res.setHeader('Content-Type','applircation/json');
	res.json({ success: true, token: token, status: 'Login Successfull'});
  });
  
  router.get('/logout', (req, res, next) => {
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