const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.get('/user', auth ,function(req,res){
    res.send({
        message: "Hey user"
    });
});

module.exports = router;