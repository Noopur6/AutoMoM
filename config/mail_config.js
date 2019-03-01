const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'notification.automom@gmail.com', // Your email id
        pass: 'automom123' // Your password
    }
});

module.exports = transporter;