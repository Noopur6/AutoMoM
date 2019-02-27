var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/User');

module.exports.register = (req, res) => {

    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err){
            console.log(err);
            res.send({
                message: "Error"
            });
        }
        else {
            let token;
            token = user.generateJwt();
            res.send({
                token: token
            });
        }
    });
}

module.exports.login = (req, res) => {
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
                token: token
            })
        }
        else{
            //user not found
            res.status(401).json(info);
        }

    })(req, res);
};