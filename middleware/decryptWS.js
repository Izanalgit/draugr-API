const crypto = require('crypto');
const { msgErr } = require('../utils/errorsMsg');

const wsDecryptMiddleware = (socket, next) => {
    const { PRIVATE_KEY } = process.env;

    const privateKey = PRIVATE_KEY.split(String.raw`\n`).join('\n');

    socket.on('message', (encryptedMessage) => {
        try {
            const decryptedMessage = crypto.privateDecrypt(
                privateKey,
                Buffer.from(encryptedMessage, 'base64')
            );

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