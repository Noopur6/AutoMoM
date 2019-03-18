const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const meetingController = require('../controllers/MeetingController');
const {
    check
} = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.post('/', [
    check('organizerEmail', 'Organizer Email is required').exists().not().isEmpty(),
    check('organizerEmail', 'Invalid email').isEmail(),
    check('participantEmail', 'Participant email is required').exists().not().isEmpty(),
    check('participantEmail', 'Participant email must be an array').isArray(),
    check('startTime', 'Start Time is required').exists(),
    check('meetingDate', 'Meeting date is required').exists(),
    check('meetingDate', 'Meeting date should be YYYY-MM-DD format').matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
    check('endTime', 'End time is required').exists(),
    check('location', 'Location is required').exists(),
    check('agenda', 'Agenda is required').exists(),
], auth, meetingController.meetingRequest); 

router.post('/list', [
    check('email', "Email is required").exists().not().isEmpty(),
    check('email', "Invalid Email").isEmail()
], auth, meetingController.meetingList);

router.put('/:operation', [
    check('operation', 'Invalid operation').isIn(['cancel','update']),
    check('id', 'Id is required').exists(),
    check('id', 'Invalid id').isMongoId()
], auth, meetingController.updateMeeting);

router.post('/end',[
    check('id', 'Id is required').exists(),
    check('id', 'Invalid id').isMongoId()
], auth, meetingController.endMeeting);

router.get('/:meetingId', [
    check('meetingId','Invalid Id').isMongoId()
], auth, meetingController.getMeetingById);

module.exports = router;