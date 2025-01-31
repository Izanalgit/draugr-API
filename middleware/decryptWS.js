const crypto = require('crypto');
const { msgErr } = require('../utils/errorsMsg');

const wsDecryptMiddleware = (socket, handler) => {
    const { PRIVATE_KEY } = process.env;

    const privateKey = PRIVATE_KEY.split(String.raw`\n`).join('\n');

    socket.on('message', (encrypted) => {
        try {
            const { encryptedData, encryptedKey, iv } = JSON.parse(encrypted);
            
            const aesKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedKey, 'base64'));
    
            const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
            let decryptedMessage = decipher.update(Buffer.from(encryptedData, 'base64'));
            decryptedMessage = Buffer.concat([decryptedMessage, decipher.final()]);

            const message = JSON.parse(decryptedMessage.toString('utf8'));

            handler(message, socket);
            
        } catch (err) {
            msgErr.errConsole('decrypt ws', err);
            socket.send('error', { error: 'Invalid chiper message' });
        }
    });

    socket.on('error', (err) => {
        msgErr.errConsole('Socket error catch', err.error);
    });

};

module.exports = { wsDecryptMiddleware };