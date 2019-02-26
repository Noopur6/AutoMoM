const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//setting up mongoDB connection
let dev_db_user = 'mongodb://localhost/users'
const mongoDB = process.env.MONGODB_URI || dev_db_user;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => console.log("Connection Succesful"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//services

//starting server
app.listen(process.env.PORT || 5000, () => console.log('Server Started at 5000'))