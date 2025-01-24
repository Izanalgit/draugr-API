const express = require('express');
const handshake = require('../controllers/handshake');

const router = express.Router();

router.post('/connect', handshake);

module.exports= router;