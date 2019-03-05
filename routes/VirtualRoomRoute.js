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
    check('id', 'Id is required').exists(),
    check('id', 'Invalid id').isMongoId(),
    check('token','token is required').exists()
], auth, roomController.createVirtualRoom);

module.exports = router;