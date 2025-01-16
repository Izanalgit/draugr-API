const express = require('express');
const createChat = require('../controllers/createChat');

//Middlewares
const authToken = require('../middleware/authCheck');
const csrfTokenCheck = require('../middleware/csrfCheck');
const ratesMiddleware = require('../middleware/rateLimit');
const rateLimits = require('../config/rateLimits');
const {validate} = require('../middleware/validations');

//Validations
const { inviteValidation } = require('../validations/inviteValidations');

const router = express.Router();

router.post(
    '/create',
    ratesMiddleware('handshake',rateLimits.handshake),
    authToken,  
    csrfTokenCheck,
    inviteValidation,
    validate, 
    createChat
);

module.exports= router;