const express = require('express');
const router = express.Router();
const homeRouters = require('./home');
const postRouters = require('./post');

router.use('/', homeRouters);
router.use('/', postRouters);

module.exports = router;