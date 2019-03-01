const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const meetingController = require('../controllers/MeetingController');
const { check } = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})
console.log("in meeting req");
router.post('/',[
    check('organizerEmail','Valid email is required').exists().isEmail(),
    check('participantEmail','Valid email is required').exists().isEmail(),
    check('dateTime','dateTime is required').exists(),
    check('agenda','Agenda is required').exists(),
    check('status','Status is required').exists()  
],meetingController.meetingRequest);

router.post('/list',auth,meetingController.meetingList);

router.post('/cancel',[
    check('id','Id is required').exists()
],auth,meetingController.cancelMeeting);

module.exports = router;