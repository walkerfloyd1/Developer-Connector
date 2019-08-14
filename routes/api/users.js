const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
// GET api/users
// @desc    Register User
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please use a valid email').isEmail(),
    check('password', 'Please enter a password of 8 or more characters').isLength({ min: 8 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send('User route');
    });

module.exports = router;