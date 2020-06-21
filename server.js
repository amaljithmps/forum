const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { urlencoded } = require('express');

//database
mongoose.connect('mongodb+srv://amaljith:amaljith@redditclone-sx0tw.mongodb.net/test1?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Database Connection Established...')})
    .catch(err => console.error(err));

//Middleware

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//start server
app.listen(process.env.PORT || 3300, () => console.log("Server Connection Established"));
console.log(process.env.PORT);

//models
const ForumModel = require('./models/forumModel');

//controllers
const forumControl = require('./controllers/forumControl');
forumControl(app,ForumModel);