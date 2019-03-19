const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

const {check} = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

//write routes here

module.exports = router;