const crypto = require('crypto');
const { msgErr } = require('../utils/errorsMsg');

const decryptMiddleware = (req, res, next) => {
    const { PRIVATE_KEY } = process.env;
    
    const privateKey = PRIVATE_KEY.split(String.raw`\n`).join('\n');

    try {
        // Json body inside encrypted layer
        const encryptedData = req.body.encryptedData;
        if (!encryptedData) {
            return res.status(400).json({ error: 'Datos cifrados no encontrados' });
        }

        const decryptedData = crypto.privateDecrypt(
            privateKey,
            Buffer.from(encryptedData, 'base64') // crypt data on base64 !!
        );

        req.body = JSON.parse(decryptedData.toString('utf8'));
        next();

    } catch (err) {
        msgErr.errConsole('decrypt body', err);
        res.status(400).json({ error: 'Datos cifrados inválidos' });
    }
};

module.exports = { decryptMiddleware };