const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { urlencoded } = require('express');
require('dotenv/config');
const bodyParser = require('body-parser');

//database
mongoose.connect(process.env.DB_connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => { console.log('Database Connection Established...')})
    .catch(err => console.error(err));

//Middleware

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());

//start server
app.listen(process.env.PORT || 3000, () => console.log("Server Connection Established"));

//models
const ForumModel = require('./models/forumModel');

//controllers
const forumControl = require('./controllers/forumControl');
forumControl(app,ForumModel);