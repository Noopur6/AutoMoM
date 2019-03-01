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
        check('password', "Password is required").exists(),
        check('email', "Invalid Email").isEmail(),
        check('password', "Password should be alphanumeric").isAlphanumeric()
    ] 
    ,authController.register);

router.post('/login',[
        check('email', "Email is required").exists(),
        check('email', "Invalid Email").isEmail(),
        check('password', "Password is required").exists()
    ], authController.login);

module.exports = router;