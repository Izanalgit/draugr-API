const express = require('express');
const loadChat = require('../controllers/loadChat');

//Middlewares
const authToken = require('../middleware/authCheck');
const csrfTokenCheck = require('../middleware/csrfCheck');
const ratesMiddleware = require('../middleware/rateLimit');
const rateLimits = require('../config/rateLimits');
const {validate} = require('../middleware/validations');

//Validations
const { acceptChatValidation } = require('../validations/acceptValidation');

const router = express.Router();

router.post(
    '/load',
    ratesMiddleware('handshake',rateLimits.handshake), 
    authToken, 
    csrfTokenCheck,
    acceptChatValidation,
    validate,
    loadChat
);

module.exports= router;