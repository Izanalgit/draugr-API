const crypto = require('crypto');
const { msgErr } = require('../utils/errorsMsg');

const decryptMiddleware = (req, res, next) => {
    const { PRIVATE_KEY } = process.env;
    
    const privateKey = PRIVATE_KEY.split(String.raw`\n`).join('\n');

    try {
        // Json body inside encrypted layer
        const encrypted = req.body.encryptedData;
        if (!encrypted) {
            return res.status(400).json({ error: 'Datos cifrados no encontrados' });
        }

        const { encryptedData, encryptedKey, iv } = encrypted;

        const aesKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedKey, 'base64'));

        const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
        let decryptedData = decipher.update(Buffer.from(encryptedData, 'base64'));
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);

        req.body = JSON.parse(decryptedData.toString('utf8'));
        console.log(req.body)
        next();

    } catch (err) {
        msgErr.errConsole('decrypt body', err);
        res.status(400).json({ error: 'Datos cifrados inválidos' });
    }
};

module.exports = { decryptMiddleware };