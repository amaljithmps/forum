var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());
const passport = require('passport');


router.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

router.post('/signup', (req, res, next) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if(err) {
			res.statusCode= 500;
			res.setHeader('Content-Type','application/json');
			res.json({err: err});
        }
        else {
          	passport.authenticate('local')(req, res, () =>{
				res.statusCode= 200;
				res.setHeader('Content-Type','applircation/json');
				res.json({ success: true, status: 'Registration Successfull'});
        	});
    	}
    });
});


router.post('/login', passport.authenticate('local'), (req, res, next) => {
	res.statusCode= 200;
	res.setHeader('Content-Type','applircation/json');
	res.json({ success: true, status: 'Login Successfull'});
  });
  
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