const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let meetingRequestSchema = new mongoose.Schema({
    organizerEmail:{
        type: String,
        unique: true,
        required: true
    },
    participantEmail: {
        type: [String],
        unique: true,
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
});

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);