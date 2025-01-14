const express = require('express');
const loadChat = require('../controllers/loadChat');

//Middlewares
const authToken = require('../middleware/authCheck');
const csrfTokenCheck = require('../middleware/csrfCheck');

const router = express.Router();

router.post('/load', authToken, csrfTokenCheck, loadChat);

module.exports= router;