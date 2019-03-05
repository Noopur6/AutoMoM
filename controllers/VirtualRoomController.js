var MeetingRequest = require('../models/MeetingRequest');
const { validationResult } = require('express-validator/check');
const transporter = require('../config/mail_config');

module.exports.createVirtualRoom = (req,res) => {
    const errors = validationResult(req);
    let flag = errors.isEmpty();
    if(!flag){
        return res.send({error:errors.array({ onlyFirstError: true })});
    }
    let tokenFromClient = req.body.token;console.log("tokenFromClient "+tokenFromClient);
    MeetingRequest.findOneAndUpdate({_id:req.body.id},{$set:{token:tokenFromClient}},{ returnNewDocument: true },
        function (err, meeting) {console.log(err);
            if(err){
                res.send({error:"No meeting found by this Id"});
            }
            else{
                res.send({message:"success"});
                //send email to organiser and participant
            let mailOptions = {
                from: 'notification.automom@gmail.com', // sender address
                to: [meeting.participantEmail, meeting.organizerEmail], // list of participant
                subject: 'Automom: Token for the meeting', // Subject line
                html: "Hey,<br><br>Please login to AutoMoM and enter below token to join the meeting. "+
                "<br><br><h3>"+tokenFromClient+"</h3><br><br>Thanks,<br>Team AutoMoM" //, // plaintext body
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log('Email Error: '+error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });
            }
        });
}