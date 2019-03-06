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
        check('email', "Email is required").exists().not().isEmpty(),
        check('firstName', "First Name is required").exists(), 
        check('firstName', "First Name can contain alphabates only").isAlpha(), 
        check('lastName', "Last Name is required").isAlpha(), 
        check('lastName', "Last Name can contain alphabates only").exists(), 
        check('password', "Password is required"),
        check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
        check('email', "Invalid Email").isEmail()
    ] 
    ,authController.register);

router.post('/login',[
        check('email', "Email is required").exists().not().isEmpty(),
        check('email', "Invalid Email").isEmail(),
        check('password', "Password is required").exists(),
        check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    ], authController.login);

module.exports = router;