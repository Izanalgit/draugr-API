const express = require('express');
const handshake = require('../controllers/handshake');

const router = express.Router();

router.get('/connect', handshake);

module.exports= router;