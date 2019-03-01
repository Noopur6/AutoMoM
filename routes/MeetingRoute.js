const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const meetingController = require('../controllers/MeetingController');
const { check } = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.post('/',[
    check('organizerEmail','Valid email is required').exists().isEmail(),
    check('participantEmail','Valid email is required').exists().isEmail(),
    check('startDateTime','Start Date is required').exists(),
    check('endDateTime','End Date is required').exists(),
    check('location','location is required').exists(),
    check('agenda','Agenda is required').exists(), 
],meetingController.meetingRequest);

router.post('/cancel',[
    check('id','Id is required').exists()
],auth,meetingController.cancelMeeting);

router.post('/',auth,meetingController.meetingRequest);
router.post('/list',[
    check('email',"email is required").exists()
],auth,meetingController.meetingList);
router.post('/cancel',meetingController.cancelMeeting);
router.put('/update',[
    check('organizerEmail',"Organizer email should not be given.")
],meetingController.updateMeeting);
module.exports = router;