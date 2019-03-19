const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const passwordController = require('../controllers/PasswordController');

const {check} = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

//reset password screen
router.get('/reset/:uniqueId', passwordController.reset);

router.post('/forgot',[
    check('email', "Email is required").exists().not().isEmpty(),
    check('email', "Invalid Email").isEmail()
], passwordController.forgot);

module.exports = router;