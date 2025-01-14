const { getHSToken, getCSRFToken} = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');
 
module.exports = async (req, res) => {
    try {
        const handshakeToken = await getHSToken();
        const csrfToken = await getCSRFToken();

        return res
            .status(200)
            .set('Authorization', handshakeToken)
            .json({ csrfToken });

    } catch (err) {
        msgErr.errConsole('Handshake', err.message || 'Unknown error');
        return res
            .status(500)
            .json({ error: 'Fallo al establecer conexión. Intentalo de nuevo.' });
    }
};