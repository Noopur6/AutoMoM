const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const authController = require('../controllers/AuthController');
const { check } = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.post('/register', [
        check('email', "Email is required").exists(),
        check('firstName', "First Name is required").exists(), 
        check('lastName', "Last Name is required").exists(), 
        check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
        check('email', "Invalid Email").isEmail(),
        check('password', "Password should be alphanumeric").isAlphanumeric()
    ] 
    ,authController.register);

router.post('/login',[
        check('email', "Email is required").exists(),
        check('email', "Invalid Email").isEmail(),
        check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    ], authController.login);

module.exports = router;