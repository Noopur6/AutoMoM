const passport = require('passport');
const mongoose = require('mongoose');
const MeetingRequest = require('../models/MeetingRequest');
const { validationResult } = require('express-validator/check');

module.exports.meetingRequest= (req,res)=> {
    const errors=validationResult(req);
    let flag=errors.isEmpty();
    if(!flag){
        return res.send({error: errors.array()});
    }
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
        const errors=validationResult(req);
        let flag=errors.isEmpty();
        if(!flag){
          return res.send({error:errros.array()});
        }
        let id=req.body.id;
        MeetingRequest.update({'_id':id},{'$set':{'status':'cancelled'}},function(err,meetingRequest){
            if (err) {
                console.log(err);
                res.send({
                    error: "No meeting found"
                });
            }
            else{
                res.send({message: 'Meeting cancelled'});
            }        
        })
}