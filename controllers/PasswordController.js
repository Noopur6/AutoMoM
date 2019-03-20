const User = require('../models/User');
const { validationResult } = require('express-validator/check');
const path = require('path');
const commonUtils = require('../utility/CommonUtility');
const emailTemplate = require('../email-templates/forget-pass');
const crypto = require('crypto');
const key = crypto.randomBytes(32);

// module.exports.reset = (req, res) => {
//     res.sendFile('resetview.html', { root: path.join(__dirname, '../views') })
// }

module.exports.reset = (req, res) => {
    const errors=validationResult(req);
    let flag=errors.isEmpty();
    if(!flag){
        return res.send({status:'E', message: 'Validations failed',error: errors.array({ onlyFirstError: true })});
    }
    let token = req.body.token;
    User.findOne({'resetToken' : token}, function(err, user){
        if(err) {
            res.send({
                status:"E",
                error: [
                    {
                        msg: err
                    }
                ]
            });
        }else if(user == null) {
            return res.send({
                status:"E",
                message:"Invalid token"
            });
        } else {
            let diff = Math.round(Math.abs((new Date(decrypt(token)).getTime() - new Date().getTime())/(24*60*60*1000)));
            if(diff<0 || diff>2){
                return res.send({
                    status:"E",
                    message:"Token expired"
                });
            }
            user.setPassword(req.body.password);
            user.resetToken = null;
            User.updateOne({resetToken : token}, user, function(err){
                if(err) {
                    res.send({
                        status:"E",
                        error: [
                            {
                                msg: err
                            }
                        ]
                    });
                } else {
                    res.send({
                        status:"C",
                        message:"Success"
                    });
                }
            });
        }
    });
}

module.exports.change = (req, res) => {
    const errors=validationResult(req);
    let flag=errors.isEmpty();
    if(!flag){
        return res.send({status:'E', message: 'Validations failed',error: errors.array({ onlyFirstError: true })});
    }
    User.findOne({email : req.body.email}, function(err, user){
        if(err) {
            res.send({
                status:"E",
                error: [
                    {
                        msg: err
                    }
                ]
            });
        }else if(user == null) {
            return res.send({
                status:"E",
                message:"User not found"
            });
        } else {
            user.setPassword(req.body.password);
            User.updateOne({email : req.body.email}, user, function(err){
                if(err) {
                    res.send({
                        status:"E",
                        error: [
                            {
                                msg: err
                            }
                        ]
                    });
                } else {
                    res.send({
                        status:"C",
                        message:"Success"
                    });
                }
            });
        }
    });
}

module.exports.forgot = (req, res) => {
    const errors=validationResult(req);
    let flag=errors.isEmpty();
    if(!flag){
        return res.send({status:'E', message: 'Validations failed',error: errors.array({ onlyFirstError: true })});
    }

    let encryptedToken = encrypt(new Date().toISOString());
    
    User.findOneAndUpdate({email : req.body.email}, {$set:{resetToken:encryptedToken}}, { returnNewDocument: true }, 
        function(err, user){
        if(err) {
            res.send({
                status:"E",
                error: [
                    {
                        msg: err
                    }
                ]
            });
        }else if(user == null) {
            return res.send({
                status:"E",
                message:"User not found"
            });
        } else {
            res.send({
                status:"C",
                message:"Success"
            });

            //preparing url
            let url = 'https://automom-dev.herokuapp.com/password/reset/'+encryptedToken;

            //send mail
            commonUtils.sendMail(req.body.email, null, 'AutoMoM: Reset Password', 
            emailTemplate.bringThatForgotPasswordTemplate(url, req.body.email));
        }
    }); 
}

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from('3c1972b10646fdee4525b0bc5eebdadf', 'hex'));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decrypt(text) {
    let iv = Buffer.from('3c1972b10646fdee4525b0bc5eebdadf', 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}