const express = require('express');
const router = express.Router();

// GET api/profile
// Testing
// @access Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;