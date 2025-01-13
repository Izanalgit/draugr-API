const express = require('express');
const loadChat = require('../controllers/loadChat')

const router = express.Router();

router.post('/load',loadChat);

module.exports= router;