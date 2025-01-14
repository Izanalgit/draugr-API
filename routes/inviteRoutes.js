const express = require('express');
const createChat = require('../controllers/createChat');

//Middlewares
const authToken = require('../middleware/authCheck');
const csrfTokenCheck = require('../middleware/csrfCheck');

const router = express.Router();

router.post('/create', authToken, csrfTokenCheck, createChat);

module.exports= router;