const express = require('express');

const router = express.Router();

router.use('/', require('./inviteRoutes'));
router.use('/', require('./loadRoutes'));

module.exports = router;