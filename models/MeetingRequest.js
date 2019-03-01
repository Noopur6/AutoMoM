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
    dateTime: {
        type: Date,
        required: true
    },
    agenda: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);