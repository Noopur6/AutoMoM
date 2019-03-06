const socketioJwt = require('socketio-jwt');

initSocket = (httpObj) => {
    const io = require('socket.io')(httpObj);
    io.sockets
    .on('connection', socketioJwt.authorize({
        secret: 'MY_SECRET',
        timeout: 15000 // 15 seconds to send the authentication message

    })).on('authenticated', function (socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log('hello! ');
        socket.on('chat message', function (msgString) {
            let msg = JSON.parse(msgString);
            let conversation = "[" + msg.timestamp+"] " + msg.sender + " : "+msg.msg; 
            io.emit('chat message', conversation);
        });
    });
}

module.exports = initSocket
