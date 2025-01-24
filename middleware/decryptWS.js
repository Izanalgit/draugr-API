const crypto = require('crypto');
const { msgErr } = require('../utils/errorsMsg');

const wsDecryptMiddleware = (socket, next) => {
    const { PRIVATE_KEY } = process.env;

    const privateKey = PRIVATE_KEY.split(String.raw`\n`).join('\n');

    socket.on('message', (encrypted) => {
        try {
            const { encryptedData, encryptedKey, iv } = encrypted;
            
            const aesKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedKey, 'base64'));
    
            const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
            let decryptedData = decipher.update(Buffer.from(encryptedData, 'base64'));
            decryptedData = Buffer.concat([decryptedData, decipher.final()]);

            const message = JSON.parse(decryptedMessage.toString('utf8'));
            socket.emit('decryptedMessage', message);
            
        } catch (err) {
            msgErr.errConsole('decrypt ws', err);
            socket.emit('error', { error: 'Mensaje cifrado inválido' });
        }
    });

    next();
};

module.exports = { wsDecryptMiddleware };