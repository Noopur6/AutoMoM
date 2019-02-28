const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const meetingController = require('../controllers/MeetingController');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.post('/',auth,meetingController.meetingRequest);
router.post('/list',auth,meetingController.meetingList);

module.exports = router;