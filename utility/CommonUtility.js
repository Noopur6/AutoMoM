const transporter = require('../config/mail_config');

module.exports.sendMail = function(toEmail, ccMail, subjectContent, body) {

    let mailOptions = {
        from: 'notification.automom@gmail.com',
        to: toEmail, // list of participant
        cc: ccMail, //organiser email
        subject: subjectContent, // Subject line
        html: body //, // plaintext body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log('Email Error: '+error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

// module.exports.formatDate = (date) => {
//     date = new Date(date);
  
//     const year = date.getFullYear()
//     const month = twoDigit(date.getMonth() + 1)
//     const day = twoDigit(date.getDate())
  
//     return `${day}-${month}-${year}`
// }

// function twoDigit (n) {
//     return ('0' + n).slice(-2)
// }