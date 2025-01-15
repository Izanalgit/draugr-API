const activeConnections = require('./connections');
const wsAuthMiddleware = require('../middleware/authWSCheck');
const { sendAcceptedChat , sendEncryptedMessage } = require('./events');
const { getSession } = require('../services/sessionsServices');
const { decodeToken } = require('../utils/decodeToken');
const { tokenSecret } = require('../config/tokens');
const { msgErr } = require('../utils/errorsMsg');

//WSS HANDLER
async function handleSocketConnection(ws, req) {
    // Auth every single message
    const isAuthenticated = await wsAuthMiddleware(ws, req);
    if (!isAuthenticated) return;

    // Init connection as alive
    ws.isAlive = true;

    // Get pong , get alive
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', async (data) => {

        try {
            const { chatToken, authToken, action, encryptedMessage } = JSON.parse(data);

            // Check chatToken
            const session = getSession(chatToken);
            if (!session) 
                throw new Error('Session not found');

            // Check authToken
            if (!Object.values(session.authTokens).includes(authToken)) 
                throw new Error('Invalid AuthToken');

            // Check user UUID
            const userUUID = decodeToken(authToken, tokenSecret).user;
            if(!Object.values(session.authIDs).includes(userUUID))
                throw new Error('Invalid user UUID');

            // Create connection
            if (!activeConnections.has(authToken)) {
                activeConnections.set(authToken, ws);
                console.log(`User registered: ${authToken}`); //CHIVATO
            }

            // Recipient user select
            const recipientKey = authToken === session.authTokens.user1 
                ? session.authTokens.user2 
                : session.authTokens.user1;

            // Check if recipient is connected
            const recipientWs = activeConnections.get(recipientKey);
            
            // WS Actions
            if (recipientWs) {
                console.log(`Message sent to ${recipientKey} by ${authToken}:`, action); //CHIVATO
                switch (action) {
                    case 'CHAT_ACCEPTED':
                        sendAcceptedChat(authToken,recipientWs);
                        break;
                    case 'ENCRYPTED_MESSAGE':
                        sendEncryptedMessage(authToken,recipientWs,encryptedMessage);
                        break;
                    default:
                        ws.send(JSON.stringify({ error: 'Acción no reconocida' }));
                        break;
                }
            }
            else
                ws.send(JSON.stringify({ error: 'Contacto desconectado' }));

        } catch (error) {
            msgErr.errConsole('process message chat',error.message)
            ws.send(JSON.stringify({ error: 'Error procesando mensaje' }));
        }
    });

    //WSS CLOSE
    ws.on('close', () => {
        console.log('Conexión cerrada'); //CHIVATO

        // Delete user from active connections
        for (const [authToken, socket] of activeConnections.entries()) {
            if (socket === ws) {
                activeConnections.delete(authToken);
                break;
            }
        }
    });
}

// Ping/Pong interval
const interval = setInterval(() => {
    activeConnections.forEach((ws, authToken) => {
        if (ws.isAlive === false) {
            console.log(`Terminating inactive connection: ${authToken}`); //CHIVATO
            activeConnections.delete(authToken);
            
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

// Ping/Pong signal termination
process.on('SIGTERM', () => {
    clearInterval(interval);
    console.log('WebSocket server shutting down'); //CHIVATO
});

module.exports = { handleSocketConnection };