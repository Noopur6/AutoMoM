const passport = require('passport');
const mongoose = require('mongoose');
const MeetingRequest = require('../models/MeetingRequest');

module.exports.meetingRequest= (req,res)=> {
    let meetRequest = new MeetingRequest();
    
    meetRequest.organizerEmail = req.body.organizerEmail;
    meetRequest.participantEmail = req.body.participantEmail;
    meetRequest.dateTime = req.body.dateTime;
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
                message: "meeting has been generated"
            });
        }
    });
}

module.exports.meetingList= (req,res)=> {

    let email = req.body.email;
    MeetingRequest.find({
        $or: [
            {organizerEmail: email},
            {participantEmail: {$elemMatch:{$eq: email}}}
        ]}, {'organizerEmail':1, "agenda":1, "participantEmail":1, _id:0 }, function(err, meetings) {
        if (err){
            console.log(err);
            res.send({
                message: "Error"
            });
        }
        else {
            res.send(meetings);
        }
    });
}

//cancel meeting
module.exports.cancelMeeting= function(req,res) {
    
        //let email = req.body.email;
        let id=req.body.id;
        MeetingRequest.update({'_id':id},{'$set':{'status':'cancelled'}},function(err,meetingRequest){
            if (err) {
                console.log(err);
                res.send({
                    error: "No data found"
                });
            }
            else{
                res.send({message: 'Meeting cancelled'});
            }        
        })
}