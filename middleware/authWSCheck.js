const { checkHSToken } = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');

async function wsAuthMiddleware(ws, req, next) {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            ws.close(4001, 'Token de autenticación no proporcionado');
            return false;
        }

        const tokenCheck = await checkHSToken(token);
        if (!tokenCheck) {
            ws.close(4002, 'Token de autenticación inválido');
            return false;
        }

        return true;

    } catch (error) {
        msgErr.errConsole('authToken WS middleware:', error.message);
        ws.close(1011, 'Error interno del servidor');
        return false;
    }
}

module.exports = wsAuthMiddleware;
