const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoute = require('./routes/AuthRoute');
const profileRoute = require('./routes/profilesRoute');
const meetingRoute=require('./routes/MeetingRoute');
const roomRoute=require('./routes/VirtualRoomRoute');
const cors = require('cors');
const port = process.env.PORT || 5000;
const socketioJwt = require('socketio-jwt');

require('./models/db');
require('./config/passport')
const app = express();

//socket.io websocket integration with app
const http = require('http').Server(app);
const io = require('socket.io')(http);

//use cors middleware
app.use(cors());

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//initialize passport middleware
app.use(passport.initialize());

//services
app.use('/api', authRoute);
app.use('/profiles', profileRoute);
app.use('/meeting',meetingRoute);
app.use('/virtualRoom', roomRoute);
app.use('/meeting', meetingRoute)

//catch unauthorised acces
app.use((err, req, res, next) => {
    if (err.name == 'UnauthorizedError') {
        res.status(401);
        res.send({
            message: err.name
        })
    }
})

//websocket events
// io.on('connection', function (socket) {
//     console.log('user connected');
//     socket.on('chat message', function (msg) {
//         io.emit('chat message', msg);
//     });
// });

io.sockets
    .on('connection', socketioJwt.authorize({
        secret: 'MY_SECRET',
        timeout: 15000 // 15 seconds to send the authentication message

    })).on('authenticated', function (socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log('hello! ');
        socket.on('chat message', function (msg) {
            console.log(msg);
            io.emit('chat message', msg);
        });
    });

//starting server
http.listen(port, function () {
    console.log('listening on *:' + port);
});