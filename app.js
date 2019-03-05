const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoute = require('./routes/AuthRoute');
const profileRoute = require('./routes/profilesRoute');
const meetingRoute=require('./routes/MeetingRoute');
const roomRoute=require('./routes/VirtualRoomRoute');
const cors = require('cors');

require('./models/db');
require('./config/passport')
const app = express();
//use cors middleware
app.use(cors());

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//initialize passport middleware
app.use(passport.initialize());

//services
app.use('/api',authRoute);
app.use('/profiles', profileRoute);
app.use('/meeting',meetingRoute);
app.use('/virtualRoom', roomRoute);

//catch unauthorised acces
app.use((err, req, res, next) => {
    if (err.name == 'UnauthorizedError'){
        res.status(401);
        res.send({
            message: err.name
        })
    }
})

//starting server
app.listen(process.env.PORT || 5000, () => console.log('Server Started at 5000'))