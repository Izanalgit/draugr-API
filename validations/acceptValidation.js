const { body } = require('express-validator');

// JWT format
const tokenFormat = (value) => {
    if (!value.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
        throw new Error('El formato del Token es inválido');
    }
    return true;
}

const acceptChatValidation = [
    body('payload.chatToken')
        .trim()
        .notEmpty()
        .withMessage('Token de chat requerido')
        .custom(tokenFormat),
    body('payload.userToken')
        .trim()
        .notEmpty()
        .withMessage('Token de user requerido')
        .custom(tokenFormat)
    
]

module.exports = { acceptChatValidation };
