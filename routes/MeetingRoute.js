const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const meetingController = require('../controllers/MeetingController');
const { check } = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.post('/',auth,meetingController.meetingRequest);
router.post('/list',[
    check('email',"email is required").exists()
],auth,meetingController.meetingList);
router.post('/cancel',meetingController.cancelMeeting);
module.exports = router;