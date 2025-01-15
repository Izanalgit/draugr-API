const express = require('express');
const createChat = require('../controllers/createChat');

//Middlewares
const authToken = require('../middleware/authCheck');
const csrfTokenCheck = require('../middleware/csrfCheck');
const ratesMiddleware = require('../middleware/rateLimit');
const rateLimits = require('../config/rateLimits');

const router = express.Router();

router.post(
    '/create',
    ratesMiddleware('handshake',rateLimits.handshake), 
    authToken,  
    csrfTokenCheck,
    createChat
);

module.exports= router;