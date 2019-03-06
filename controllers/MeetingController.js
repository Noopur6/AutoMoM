var MeetingRequest = require('../models/MeetingRequest');
const { validationResult } = require('express-validator/check');
var commonUtility = require('../utility/CommonUtility');

module.exports.meetingRequest= (req,res)=> {
    const errors=validationResult(req);
    let flag=errors.isEmpty();
    if(!flag){
        return res.send({error: errors.array({ onlyFirstError: true })});
    }
    let meetRequest = new MeetingRequest();
    meetRequest.organizerEmail = req.body.organizerEmail;
    meetRequest.participantEmail = req.body.participantEmail;
    meetRequest.meetingDate = req.body.meetingDate;
    meetRequest.startTime = req.body.startTime;
    meetRequest.endTime = req.body.endTime;
    meetRequest.location = req.body.location;
    meetRequest.agenda = req.body.agenda;
    meetRequest.status="y";

    meetRequest.save(function(err) {
        if (err){
            console.log(err);
            res.send({
                message: "Error"
            });
        }
        else {
            res.send({
                message: "Meeting has been generated"
            });
            commonUtility.sendMail(meetRequest.participantEmail, meetRequest.organizerEmail,
                'Automom: Meeting has been scheduled', "Hey,<br><br>You are invited to join the meeting on <b>"+
                meetRequest.meetingDate+" "+meetRequest.startTime+"</b> by "+meetRequest.organizerEmail+". Please login to AutoMoM to know more. <br><br>Thanks,<br>Team AutoMoM.");
        }
    });
}

module.exports.meetingList= (req,res)=> {

    const errors = validationResult(req);
    let flag = errors.isEmpty();
    if(!flag){
        return res.send({error: errors.array({ onlyFirstError: true })});
    }
    let email = req.body.email;
    MeetingRequest.find({
        $or: [
            {organizerEmail: email},
            {participantEmail: {$elemMatch:{$eq: email}}}
        ]},{ "_id": 1, "organizerEmail": 1, "participantEmail":1, "meetingDate":1, "startTime":1,
         "endTime":1, "location":1, "agenda":1, "status":1}, function(err, meetings) {
        if (err){
            console.log(err);
            res.send({
                message: "Some Error occurred"
            });
        }
        else if(meetings.length==0){
            res.send({
                message: "There are no meetings for this user."
            });
        }
        else {
            res.send(meetings);
        }
    });
}

//update meeting
module.exports.updateMeeting = function(req,res) {

    const errors = validationResult(req);
    let flag = errors.isEmpty();
    if(!flag){
        return res.send({error: errors.array({ onlyFirstError: true })});
    }
    let operation = req.params.operation;
    let query;
    if (operation === "cancel"){
        query = {$set:{'status' : 'n'}};
    } else if(operation === "update"){
        query = req.body;console.log(req.body);
    }

    MeetingRequest.findOneAndUpdate({_id: {$eq: req.body.id}},query,{ returnNewDocument: true },function(err, meeting){
        if (err) {
            console.log(err);
            res.send({
                error: "No meeting found by this Id"
            });
        }
        else{
            res.send({message: 'Success'});
            //send email to organiser and participant
            if(operation === "cancel"){
                commonUtility.sendMail(meeting.participantEmail, meeting.organizerEmail,
                    'Automom: Meeting has been cancelled', "Hey,<br><br>The meeting on <b>"+
                    meeting.meetingDate+" "+meeting.startTime+"</b> by "+meeting.organizerEmail+" has been cancelled. Please login to AutoMoM to know more. <br><br>Thanks,<br>Team AutoMoM.");
            }
            else {
                commonUtility.sendMail(meeting.participantEmail, meeting.organizerEmail,
                    'Automom: Meeting has been updated', "Hey,<br><br>You are invited to join the meeting on <b>"+
                    meeting.meetingDate+" "+meeting.startTime+"</b> by "+meeting.organizerEmail+". Please login to AutoMoM to know more. <br><br>Thanks,<br>Team AutoMoM.");
            }
        }        
    })
}