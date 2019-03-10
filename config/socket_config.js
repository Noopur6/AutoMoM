const socketioJwt = require('socketio-jwt');
var MeetingRequest = require('../models/MeetingRequest');
var messageDictionary = {};

initSocket = (httpObj) => {
    const io = require('socket.io')(httpObj);
    io.sockets
    .on('connection', socketioJwt.authorize({
        secret: 'MY_SECRET',
        timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function (socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log('hello!');
        socket.on('chat message', function (msg) {
            let message = JSON.parse(msg);
            let meetingId = message.id;
            delete message.id;
            if(messageDictionary.hasOwnProperty(meetingId)){
                messageDictionary[meetingId].push(message);
                if (messageDictionary[meetingId].length === 5){
                    dbBatchInsertSingle(meetingId, messageDictionary[meetingId]);
                }
            } else {
                messageDictionary[meetingId] = [message];
            }
            io.emit('chat message', msg);
        });
    });
}

function dbBatchInsertSingle(id, msgArray) {
    console.log('Inserting...');
    MeetingRequest.findOneAndUpdate({ _id: id},{ $push: { conversation: {$each : msgArray} } }, 
        function(err){
            if(err){
                console.log(err);
            }
    });
    messageDictionary[id] = [];
}

function dbBatchInsert() {
    for (var i in messageDictionary){
		MeetingRequest.findOneAndUpdate({ _id: i},{ $push: { conversation: {$each : messageDictionary[i]} } }, 
            function(err){
                if(err){
                    console.log(err);
                }
        });
        messageDictionary[i] = [];
	}
}
//var insertInDb = setInterval(dbBatchInsert, 1000);
module.exports = initSocket;
