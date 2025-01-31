const url = require('node:url');
const { checkHSToken } = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');

async function wsAuthMiddleware(urlWS) {
    try {
        const query = url.parse(urlWS, true).query;
        const token = query.authorization;

        if (!token) {
            msgErr.errConsole('authToken WS middleware:', 'handshake token missing');
            return false;
        }

        const tokenCheck = await checkHSToken(token);
        if (!tokenCheck) {
            msgErr.errConsole('authToken WS middleware:', 'invalid handshake token');
            return false;
        }

        return true;

    } catch (error) {
        msgErr.errConsole('authToken WS middleware:', error.message);
        return false;
    }
}

module.exports = wsAuthMiddleware;
