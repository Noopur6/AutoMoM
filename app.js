const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoute = require('./routes/AuthRoute');
const profileRoute = require('./routes/profilesRoute');

require('./models/db');
require('./config/passport')

const app = express();

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//setting up mongoDB connection
// let dev_db_user = 'mongodb://localhost/users'
// const mongoDB = process.env.MONGODB_URI || dev_db_user;

// mongoose.connect(mongoDB, { useNewUrlParser: true })
//     .then(() => console.log("Connection Succesful"))
//     .catch((err) => console.log(err));

// mongoose.Promise = global.Promise;

// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//initialize passport middleware
app.use(passport.initialize());

//services
app.use('/api',authRoute);
app.use('/profiles', profileRoute);

//starting server
app.listen(process.env.PORT || 5000, () => console.log('Server Started at 5000'))