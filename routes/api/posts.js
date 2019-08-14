const express = require('express');
const router = express.Router();

// GET api/posts
// Testing
// @access Public
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;