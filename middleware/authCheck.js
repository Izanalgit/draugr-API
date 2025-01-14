const { checkHSToken } = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');

async function authToken(req, res, next) {
    try {
        const token = req.get('Authorization');

        if (!token) 
            return res
                .status(401)
                .json({ error: 'Token de autenticación no encontrado' });

        const tokenCheck = await checkHSToken(token);

        if (!tokenCheck) 
            return res
                .status(401)
                .json({ error: 'Token de autenticación no válido' });

        return next();

    } catch (error) {
        msgErr.errConsole('authToken middleware:', error);
        return res
            .status(500)
            .json({ error: 'Error interno del servidor' });
    }
}

module.exports = authToken;