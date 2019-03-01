const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let meetingRequestSchema = new mongoose.Schema({
    organizerEmail:{
        type: String,
        required: true
    },
    participantEmail: {
        type: [String],
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    agenda: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
});

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);