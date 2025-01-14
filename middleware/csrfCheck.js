const { checkCSRFToken } = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');

async function csrfTokenCheck(req,res,next){
    try {
        const token = req.body?.csrfToken;

        if (!token) 
            return res
                .status(401)
                .json({ error: 'Token CSRF no encontrado' });

        const tokenCheck = await checkCSRFToken(token);

        if (!tokenCheck) 
            return res
                .status(401)
                .json({ error: 'Token CSRF no válido' });

        return next();

    } catch (error) {
        msgErr.errConsole('CSRF middleware:', error);
        return res
            .status(500)
            .json({ error: 'Error interno del servidor' });
    }
}

module.exports = csrfTokenCheck;