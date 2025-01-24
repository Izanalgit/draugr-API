const { getHSToken, getCSRFToken} = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');
const { HANDSHAKE_KEY } = process.env;

module.exports = async (req, res) => {

    const {payload} = req.body;

    if(!payload)
        return res
            .status(400)
            .json({ error: msgErr.errPayloadRequired });


    const {giveMe} = payload

    if(!giveMe || giveMe != HANDSHAKE_KEY){
        msgErr.errConsole('Handshake', 'incorrect giveMe');
        return res
            .status(400)
            .json({ error: msgErr.errPayloadIncorrect });
    }


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