const express = require('express');
const router = express.Router();
const dashboardRouters = require('./dashboard');
const postRouters = require('./posts');
const commentRouters = require('./comments');
const userRouters = require('./users');
const settingRouters = require('./settings');

router.use('/dashboard', dashboardRouters);
router.use('/posts', postRouters);
router.use('/comments', commentRouters);
router.use('/users', userRouters);
router.use('/settings', settingRouters);

module.exports = router;