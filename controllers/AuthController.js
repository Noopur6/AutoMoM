const passport = require('passport');
const User = require('../models/User');
const { validationResult } = require('express-validator/check');

module.exports.register = (req, res) => {
    
    //check validation erros
    let errors = validationResult(req);
    //errors.useFirstErrorOnly().array();
    let flag = errors.isEmpty();
    
    if (!flag) {
        return res.send({status:'E', message: 'Validations failed',error: errors.array({ onlyFirstError: true })});
    }

    let user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err){
            if (err.code == 11000){
                res.send({
                    status:"E",
                    error: [
                        {
                            msg: "User already exists"
                        }
                    ]
                });
            }
            else{
                res.send({
                    status:"E",
                    error: [
                        {
                            msg: "Some error occured"
                        }
                    ]
                });
            }
        }
        else {
            let token;
            token = user.generateJwt();
            res.send({
                status:"C",
                message:"Success",
                token: token
            });
        }
    });
}

module.exports.login = (req, res) => {

    //check validation erros
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.send({status:'E', message: 'Validations failed',error: errors.array({ onlyFirstError: true })});
    }

    passport.authenticate('local', function(err, user, info) {
        let token;

        //if error occured, catch and throw
        if (err) {
            res.status(404).json(err);
        }

        //if user found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.send({
                status:"C",
                token: token,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            })
        }
        else{
            //user not found
            res.status(401).json(info);
        }

    })(req, res);
};