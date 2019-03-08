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
    meetingDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
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
    token: {
        type: String
    },
    conversation: {
        type: [{sender: String, message: String, timestamp: Date}]
    }
});

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);