var MeetingRequest = require('../models/MeetingRequest');
const { validationResult } = require('express-validator/check');
const transporter = require('../config/mail_config');

module.exports.meetingRequest= (req,res)=> {
    const errors=validationResult(req);
    let flag=errors.isEmpty();
    if(!flag){
        return res.send({error: errors.array()});
    }
    let meetRequest = new MeetingRequest();
    meetRequest.organizerEmail = req.body.organizerEmail;
    meetRequest.participantEmail = req.body.participantEmail;
    meetRequest.startDateTime = req.body.startDateTime;
    meetRequest.endDateTime = req.body.endDateTime;
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

            //send email to organiser and participant
            let formattedDateTime = meetRequest.dateTime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            let mailOptions = {
                from: 'notification.automom@gmail.com', // sender address
                to: meetRequest.participantEmail, // list of participant
                cc: meetRequest.organizerEmail, //organiser email
                subject: 'Automom: Meeting has been created', // Subject line
                html: "Hey,<br><br>You are invited to join the meeting on <b>"+formattedDateTime+"</b> by "+meetRequest.organizerEmail+". Please login to AutoMoM to know more. <br><br>Thanks,<br>Team AutoMoM." //, // plaintext body
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    });
}

module.exports.meetingList= (req,res)=> {

    const errors = validationResult(req);
    let flag = errors.isEmpty();
    if(!flag){
        return res.send({error: errors.array()});
    }
    let email = req.body.email;
    MeetingRequest.find({
        $or: [
            {organizerEmail: email},
            {participantEmail: {$elemMatch:{$eq: email}}}
        ]}, function(err, meetings) {
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

//cancel meeting
module.exports.cancelMeeting= function(req,res) {
        const errors=validationResult(req);
        let flag=errors.isEmpty();
        if(!flag){
          return res.send({error:errros.array()});
        }
        let id=req.body.id;
        MeetingRequest.update({'_id':id},{'$set':{'status':'n'}},function(err,meetingRequest){
            if (err) {
                console.log(err);
                res.send({
                    error: "There are no meetings for this user."
                });
            }
            else{
                res.send({message: 'Meeting cancelled'});

                //send email to organiser and participant
                //let formattedDateTime = meetRequest.dateTime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                // let mailOptions = {
                //     from: 'notification.automom@gmail.com', // sender address
                //     to: meetRequest.participantEmail, // list of participant
                //     cc: meetRequest.organizerEmail, //organiser email
                //     subject: 'Automom: Meeting has been cancelled', // Subject line
                //     html: "Hey,<br><br>You meeting organised by "+meetRequest.organizerEmail+" has been cancelled. <br><br>Thanks,<br>Team AutoMoM."
                //     //html: "Hey,<br><br>You meeting on <b>"+formattedDateTime+"</b> organised by "+meetRequest.organizerEmail+" has been cancelled. <br><br>Thanks,<br>Team AutoMoM."
                // };
                // transporter.sendMail(mailOptions, function(error, info){
                //     if(error){
                //         console.log(error);
                //     }else{
                //         console.log('Message sent: ' + info.response);
                //     };
                // });
            }        
        })
}

//cancel meeting
module.exports.updateMeeting = function(req,res) {
    
    MeetingRequest.findOneAndUpdate(req.body.id,req.body,function(err){
        if (err) {
            console.log(err);
            res.send({
                error: "There are no meetings for this user."
            });
        }
        else{
            res.send({message: 'Success'});
        }        
    })
}