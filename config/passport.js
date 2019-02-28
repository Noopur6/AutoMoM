const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            // Return if user not found in database
            if (!user) {
                return done(null, false, {
                    error: 'User not found'
                });
            }
            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    error: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));