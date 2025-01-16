const { body } = require('express-validator');

const forbiddenWords = ['bomba', 'allahu', 'akbar', 'yihad', 'al-Yihad', 'al-Qaeda', 'palestina'];

const inviteValidation = [
    body('payload')
        .notEmpty()
        .withMessage('El payload es requerido'),
	body('payload.sender')
        .trim()
        .notEmpty()
        .withMessage('Nombre de referencia requerido')
        .matches(/^[a-zA-Z0-9\s]*$/)
        .withMessage('El nombre debe ser alfanumérico y puede incluir espacios')
        .isLength({ min: 3, max: 15 })
        .withMessage('El nombre debe tener entre 3 y 15 caracteres'),
    body('payload.emailRecipient')
        .trim()
        .notEmpty()
        .withMessage('Email del contacto requerido')
        .isEmail()
        .withMessage('Debe ser un email válido'),
    body('payload.message')
        .trim()
        .matches(/^[a-zA-Z0-9\s.,'’\-\u00C0-\u017F¡!¿?()""]*$/)
        // Words filter
        .custom((value) => {
            const lowerCaseMessage = value.toLowerCase(); 
            for (let word of forbiddenWords) {
                if (lowerCaseMessage.includes(word)) {
                    throw new Error(`El mensaje contiene una palabra prohibida: ${word}`);
                }
            }
            return true; 
        })
]

module.exports = { inviteValidation }