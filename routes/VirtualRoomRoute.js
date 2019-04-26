const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const roomController = require('../controllers/VirtualRoomController');
const {
    check
} = require('express-validator/check');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
})

router.post('/new', [
    check('id', 'Id is required').exists().not().isEmpty(),
    check('id', 'Invalid id').isMongoId(),
    check('token','token is required').exists()
], auth, roomController.createVirtualRoom);

router.post('/join', [
    check('id', 'Id is required').exists(),
    check('id', 'Invalid id').isMongoId(),
    check('token', 'Token is required').exists(),
    check('email', 'Email is required').exists().not().isEmpty(),
    check('email', 'Invalid email').isEmail()
],auth, roomController.joinVirtualRoom);

module.exports = router;